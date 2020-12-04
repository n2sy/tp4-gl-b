import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  currentDate : string;
  newTask : string = '';
  allTask = [];

  constructor(private angFire : AngularFireDatabase) {
    let myDate = new Date();
    let options = {weekday : 'long', month :'long', day : 'numeric' }
    this.currentDate = myDate.toLocaleDateString('en-en', options)
  }

  ngOnInit() {
    this.getTasks();
  }

  addNewTask() {
    this.angFire.list('Tasks/').push({
      text : this.newTask,
      date : new Date().toISOString(),
      checked : false
    });
    this.newTask = '';

  }

  getTasks() {
    this.angFire.list('Tasks/').snapshotChanges(['child_added']).subscribe(
      (reponse) => {
        console.log(reponse);
        this.allTask = [];
        reponse.forEach( element => {
          //console.log('****', element)
          this.allTask.push({
            key : element.key,
            text : element.payload.exportVal().text,
            date : element.payload.exportVal().date.substring(11, 16),
            checked : element.payload.exportVal().checked
          })

        })
      }
    )
  }

  changeCheckedState(tsk) {
    this.angFire.object(`Tasks/${tsk.key}/checked/`).set(tsk.checked);
  }

  deleteTask(id) {
    this.angFire.list('Tasks/').remove(id);
    this.getTasks();
  }

}
