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
import { DatePickerComponent } from './shared/utils/date-picker/date-picker.component';

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
            { path: 'links', component: LinksComponent },
            { path: 'settings', component: SettingsComponent }
        ]
    },
    { path: 'date', component: DatePickerComponent }
];
