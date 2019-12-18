import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { TradeListPage } from './trade-list.page';

const routes: Routes = [
    { 
        path: 'tabs',
        component: TradeListPage,
        children: [        
            { 
                path: 'posted', loadChildren: './posted/posted.module#PostedPageModule' 
            },
            { 
                path: 'trade', 
                children: [
                    {
                        path: '',
                        loadChildren: './trade/trade.module#TradePageModule'
                    },
                    {
                        path: ':listId',
                        children: [
                            {
                                path: '',
                                loadChildren: './trade/detail/detail.module#DetailPageModule'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: '',
        redirectTo: '/trade-list/tabs/posted',
        pathMatch : 'full'
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TradeListRoutingModule {}