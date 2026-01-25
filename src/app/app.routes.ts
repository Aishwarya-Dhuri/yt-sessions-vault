import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';
import { Batch } from './components/batch/batch';
import { authGuard } from './core/guards/auth-guard';
import { Candidate } from './components/candidate/candidate';
import { BatchEnrollments } from './components/batch-enrollments/batch-enrollments';
import { BatchSessions } from './components/batch-sessions/batch-sessions';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { CandidateDashboard } from './components/candidate-dashboard/candidate-dashboard';
import { CandidateSessionRecordings } from './components/candidate-session-recordings/candidate-session-recordings';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:Login,
    },
     {
        path:'home',
        component:Layout,
        children:[
             {
                path:'admin-dashboard',
                component:AdminDashboard,
                canActivate:[authGuard]
            },
             {
                path:'candidate-dashboard',
                component:CandidateDashboard,
                canActivate:[authGuard]
            },
            {
                path:'batch',
                component:Batch,
                canActivate:[authGuard]
            },
            {
                path:'candidate',
                component:Candidate,
                canActivate:[authGuard]
            },
            {
                path:'batch-enrollments',
                component:BatchEnrollments,
                canActivate:[authGuard]
            },
             {
                path:'batch-sessions',
                component:BatchSessions,
                canActivate:[authGuard]
            },
            {
                path:'candidate-recordings',
                component:CandidateSessionRecordings,
                canActivate:[authGuard]
            },
        ]

       
    }


];
