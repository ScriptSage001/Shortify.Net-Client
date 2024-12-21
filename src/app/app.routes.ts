import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './shared/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LinksComponent } from './links/links.component';
import { SettingsComponent } from './settings/settings.component';
import { CreateLinkComponent } from './links/create-link/create-link.component';
import { AllLinksComponent } from './links/all-links/all-links.component';
import { DetailedLinkComponent } from './links/detailed-link/detailed-link.component';
import { EditLinkComponent } from './links/edit-link/edit-link.component';
import { UpcomingComponent } from './shared/utils/upcoming/upcoming.component';

export const routes: Routes = [
    { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
    {
        path: '', component: UserComponent,
        children: [
            { path: 'sign-up', component: SignUpComponent },
            { path: 'sign-in', component: SignInComponent },
            { path: 'reset-password', component: ResetPasswordComponent }
        ]
    },
    { path: '', component: MainLayoutComponent, canActivate: [ authGuard ], 
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'settings', component: UpcomingComponent },
            { path: 'links', component: LinksComponent,
                children: [
                    { path: '', component: AllLinksComponent },
                    { path: 'create', component: CreateLinkComponent },
                    { path: ':code', component: DetailedLinkComponent },
                    { path: ':code/edit', component: EditLinkComponent }
                ]
            },
            { path: 'coming-soon', component: UpcomingComponent },
            { path: 'support', redirectTo: '/coming-soon', pathMatch: 'full' },
            { path: 'tandc', redirectTo: '/coming-soon', pathMatch: 'full' }
        ]
    },
];
