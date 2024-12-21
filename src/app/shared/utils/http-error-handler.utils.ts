import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { ProblemDetails } from "../models/problem-details";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { UserService } from "../services/user/user.service";

@Injectable({
    providedIn: 'root'
})

export class HttpErrorHandlerUtils {

    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private router: Router
    ) {}
    
    // Custom Error Handler for this component
    public handleError(error: HttpErrorResponse) {
        if (error.error && typeof error.error === 'string') {
            try {
                const parsedError = JSON.parse(error.error);

                if (typeof parsedError === 'object') {
                    this.handleStructuredError(parsedError);
                }
            } catch (parseError) {
                this.toastr.error(`Error parsing JSON: ${parseError}`);
            }

        } else if (error.error && typeof error.error === 'object') {
            this.handleStructuredError(error.error);
        } else {
            this.toastr.error(`Request failed: ${error.message || 'An unexpected error occurred.'}`);
        }
    }

    // Custom Error Handler to handle Structured (ProblemDetails) error
    private handleStructuredError(error: object) {
        const problemDetails = new ProblemDetails(error);

        if (problemDetails.status === 409) {
            this.toastr.warning(problemDetails.detail || 'Request Failed.');

            //Start a 0.5-second timer to redirect to the SignIn
            setTimeout(() => {
                this.router.navigate(['/sign-in']);
            }, 500);
        } else if (problemDetails.status === 500) {
            this.toastr.error('Internal Server Error. Please contact IT Admin.');
        } else if (problemDetails.status === 401) {
            this.toastr.error(problemDetails.detail || 'Request Failed.');
        } else if (problemDetails.status === 400
            && problemDetails.errors
            && typeof problemDetails.errors === 'object') {
            if (problemDetails.errors['Password']) {
                this.toastr.error(problemDetails.errors['Password'][0]);
            } else if (problemDetails.errors['Email']) {
                this.toastr.error(problemDetails.errors['Email'][0]);
            } else if (problemDetails.errors['Error.ValidationError']) {
                this.toastr.error(problemDetails.errors['Error.ValidationError'][0]);
            } else {
                this.toastr.error(`Request failed: ${problemDetails.title}`);
            }
        } else if (problemDetails.status === 404 && problemDetails.title === 'User.UserNotFound') {
            this.toastr.warning(problemDetails.detail, 'Please Sign Up.');
            
            //Start a 0.5-second timer to redirect to the SignIn
            setTimeout(() => {
                this.router.navigate(['/sign-up']);
            }, 500);
        } else {
            this.toastr.error(`Request failed: ${problemDetails.title}`);
        }
    }
}