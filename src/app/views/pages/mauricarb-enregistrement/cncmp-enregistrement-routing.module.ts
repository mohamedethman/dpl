import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


/**
 * @author Med.Mansour
 */
const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Enregistrement'
        },
        children: [
            {
                path: '',
                redirectTo: 'lister-assures'
            },
            // {
            //     path: 'lister-assures',
            //     component: ListeEnregistrementsComponent,
            //     data: {
            //         title: 'lister les assures'
            //     }
            // },


        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CncmpEnregistrementRoutingModule { }
