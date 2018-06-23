import { Component, OnInit } from '@angular/core';
import {User} from '../models/user';
import {Subscription} from 'rxjs';
import {GlobalService} from '../services/global.service';
import {Router} from '@angular/router';
import {VehicleService} from '../services/vehicle.service';
import {Vehicle} from '../models/vehicle';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [VehicleService]
})
export class HomeComponent implements OnInit {

  account: User = new User();
  userSub: Subscription;
  vehicle;
  selectedVeh: Vehicle;
  vehInput: FormGroup;
  isAddEditMode: boolean;
  isEdit: boolean;

  constructor(
    private global: GlobalService,
    private router: Router,
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar) {
     // this.createForm();
  }

/*  createForm() {
    this.vehInput = this.fb.group({
      year: ['', Validators.required],
      maker: ['', Validators.required],
      bodytype: ['', Validators.required],
      carmodel: ['', Validators.required],
      modeltrim: ['', Validators.required],
      msrp: 0,
      cardesc: '',
      invoice: 0,
      profit: 0,
      month: 0,
      residual10: 0,
      residual: 0,
      residual15: 0,
      moneyfactor: 0,
      leasecash: 0,
      bankfee: 0,
      downpay: 0,
      payments: 0,
      apr36: 0,
      apr48: 0,
      apr: 0,
      apr72: 0,
      rebate: 0,
      loan_payments: 0,
      featured: true
    });
  }*/

  ngOnInit() {
    this.userSub = this.global.user.subscribe(
      me => {
        this.account = me;
        }
    );
    if ( localStorage.getItem('token') && localStorage.getItem('account')) {
      this.global.me = JSON.parse(localStorage.getItem('account'));
      this.getVehicle();
    } else {
      this.router.navigate(['/login']);
    }
    this.isAddEditMode = false;
    this.isEdit = false;
    this.vehInput = this.fb.group({
      year: ['2018', Validators.required],
      maker: ['', Validators.required],
      bodytype: ['Sedan', Validators.required],
      carmodel: ['', Validators.required],
      modeltrim: ['Base', Validators.required],
      msrp: 0,
      cardesc: '',
      invoice: 0,
      profit: 0,
      month: 0,
      residual10: 0,
      residual: 0,
      residual15: 0,
      moneyfactor: 0,
      leasecash: 0,
      bankfee: 0,
      downpay: 0,
      payments: 0,
      apr36: 0,
      apr48: 0,
      apr: 0,
      apr72: 0,
      rebate: 0,
      loan_payments: 0,
    });
  }

  getVehicle() {
    this.vehicleService.getVehicle().subscribe(
      response => {
        this.vehicle = response;
      },
      error => {
        this.snackBar.open('Error getting Vehicle', '', { duration: 3000 });
      }
    );
  }
  editVehClicked() {
    this.isEdit = true;
    this.isAddEditMode = true;
    this.vehInput = this.fb.group({
      year: [this.selectedVeh.year, Validators.required],
      maker: [this.selectedVeh.maker, Validators.required],
      bodytype: [this.selectedVeh.bodytype, Validators.required],
      carmodel: [this.selectedVeh.carmodel, Validators.required],
      modeltrim: [this.selectedVeh.modeltrim, Validators.required],
      msrp: [this.selectedVeh.msrp, Validators.required],
      cardesc: [this.selectedVeh.cardesc, Validators.required],
      invoice: [this.selectedVeh.invoice, Validators.required],
      profit: [this.selectedVeh.profit, Validators.required],
      month: [this.selectedVeh.month, Validators.required],
      residual10: [this.selectedVeh.residual10, Validators.required],
      residual: [this.selectedVeh.residual, Validators.required],
      residual15: [this.selectedVeh.residual15, Validators.required],
      moneyfactor: [this.selectedVeh.moneyfactor, Validators.required],
      leasecash: [this.selectedVeh.leasecash, Validators.required],
      bankfee: [this.selectedVeh.bankfee, Validators.required],
      downpay: [this.selectedVeh.downpay, Validators.required],
      payments: [this.selectedVeh.payments, Validators.required],
      apr36: [this.selectedVeh.apr36, Validators.required],
      apr48: [this.selectedVeh.apr48, Validators.required],
      apr: [this.selectedVeh.apr, Validators.required],
      apr72: [this.selectedVeh.apr72, Validators.required],
      rebate: [this.selectedVeh.rebate, Validators.required],
      loan_payments: [this.selectedVeh.loan_payments, Validators.required],
    });

  }
  addVehClicked() {
    this.isEdit = false;
    this.isAddEditMode = true;
    this.selectedVeh = null;
    this.vehInput.reset();
  }
  submitVehicle() {
    if (this.isEdit) {
      this.vehicleService.editVeh(this.vehInput.value, this.selectedVeh.id).subscribe(
        response => {
          const vehIndx = this.vehicle.map(function (e) {return e.id; }).indexOf(this.selectedVeh.id);
          if (vehIndx >= 0) {
            this.vehicle[vehIndx] = response;
            this.selectedVeh = response;
          }
          this.vehInput.reset();
          this.isAddEditMode = false;
        },
        error => {
          this.snackBar.open('Error editing Vehicle', '', { duration: 3000 });
        }
      );
    } else {
      this.vehicleService.addVeh(this.vehInput.value).subscribe(
        response => {
          this.vehicle.push(response);
          this.vehInput.reset();
          this.isAddEditMode = false;
        },
        error => {
          this.snackBar.open('Error adding Vehicle', '', { duration: 3000 });
        }
      );
    }

  }
  deleteVehClicked() {
    this.vehicleService.deleteVeh(this.selectedVeh.id).subscribe(
      response => {
        const vehIndx = this.vehicle.map(function(e) {return e.id; }).indexOf(this.selectedVeh.id);
        if (vehIndx >= 0) {
          this.vehicle.splice(vehIndx, 1);
          this.selectedVeh = null;
        }
        this.isAddEditMode = false;
      },
      error => {
        this.snackBar.open('Error deleting Vehicle', '', { duration: 3000 });
      }
    );
  }
  vehClicked(veh: Vehicle) {
    this.selectedVeh = veh;
    this.isAddEditMode = false;
  }

 logoutClicked() {
  this.global.me = new User();
  localStorage.removeItem('token');
  localStorage.removeItem('account');
  this.router.navigate(['/login']);
}

}
