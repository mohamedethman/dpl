import { Component, OnInit } from '@angular/core';
import {NgWizardConfig, NgWizardService, STEP_STATE, StepChangedArgs, StepValidationArgs, THEME} from "ng-wizard";
import {of} from "rxjs/index";

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

    stepStates = {
        normal: STEP_STATE.normal,
        disabled: STEP_STATE.disabled,
        error: STEP_STATE.error,
        hidden: STEP_STATE.hidden
    };

    config: NgWizardConfig = {
        selected: 0,
        theme: THEME.arrows,
        toolbarSettings: {
            toolbarExtraButtons: [
                { text: 'Finish', class: 'btn btn-info', event: () => { alert("Finished!!!"); } }
            ],
        }
    };

    constructor(private ngWizardService: NgWizardService) {
    }

    ngOnInit() {
    }

    showPreviousStep(event?: Event) {
        this.ngWizardService.previous();
    }

    showNextStep(event?: Event) {
        this.ngWizardService.next();
    }

    resetWizard(event?: Event) {
        this.ngWizardService.reset();
    }

    setTheme(theme: THEME) {
        this.ngWizardService.theme(theme);
    }

    stepChanged(args: StepChangedArgs) {
        console.log(args.step);
    }

    isValidTypeBoolean: boolean = true;

    isValidFunctionReturnsBoolean(args: StepValidationArgs) {
        return true;
    }

    isValidFunctionReturnsObservable(args: StepValidationArgs) {
        return of(true);
    }
}