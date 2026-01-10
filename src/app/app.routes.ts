import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Batch } from './components/batch/batch';
import { authGuard } from './core/guards/auth-guard';
import { Candidate } from './components/candidate/candidate';

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
                path:'dashboard',
                component:Dashboard,
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
        ]

       
    }


];
