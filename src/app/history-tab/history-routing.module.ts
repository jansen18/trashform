import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { HistoryTabPage } from './history-tab.page';

const routes: Routes = [
    { 
        path: 'tabs',
        component: HistoryTabPage,
        children: [        
            { path: 'trader', loadChildren: './trader/trader.module#TraderPageModule' },
            { path: 'traded-with', loadChildren: './traded-with/traded-with.module#TradedWithPageModule' }
        ]
    },
    {
        path: '',
        redirectTo: '/history-tab/tabs/trader',
        pathMatch : 'full'
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HistoryTabRoutingModule {}