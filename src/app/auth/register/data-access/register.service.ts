import { Injectable, computed, inject, signal } from "@angular/core";
import { EMPTY, Subject, catchError, map, merge, switchMap } from "rxjs";
import { Credentials } from "../../../shared/interfaces/credentials";
import { AuthService } from "../../../shared/data-access/auth.service";
import { connect } from 'ngxtension/connect';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
}

@Injectable()
export class RegisterService {
    private authService = inject(AuthService)
    
    // sources
    error$ = new Subject<any>();
    createUser$ = new Subject<Credentials>();

    userCreated$ = this.createUser$.pipe(
        switchMap((credentials) =>
            this.authService.createAccount(credentials)
            .pipe(
                catchError((err) => {
                    this.error$.next(err);
                    return EMPTY;
                })
            )
        )
    );

    // state

    state = signal<RegisterState>({
        status: 'pending'
    });

    // selectors

    status = computed(() => this.state().status);

    constructor() {
        // reducers
        const nextState$ = merge(
            this.createUser$.pipe((map(() => ({ status: 'creating' as const })))),
            this.userCreated$.pipe((map(() => ({ status: 'success' as const })))),
            this.error$.pipe((map(() => ({ status: 'error' as const})))),
        );

        connect(this.state).with(nextState$);
    }

}