import { Component, OnInit } from '@angular/core';
import { Quiz } from './quiz.model';
import { QuizService } from './quiz.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AchievementService, userInfo } from '../achievement.service';
import { userInfoLocal } from '../userInfo.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {

  quiz : Quiz[]
  question: Quiz;
  random: number;
  answer: number;
  current: number;
  questionList: number[] = [];
  totalCorrect: number;
  userInfoLocal: userInfoLocal;
  userInfo: userInfo;

  constructor(
    private router: Router,
    private quizSvc: QuizService,
    private achievementSvc: AchievementService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.quiz = this.quizSvc.getQuestion();
    this.current = 0;
    this.totalCorrect = 0;

    while(this.questionList.length < 3){
      this.random = Math.floor(Math.random() * Math.floor(this.quiz.length));
      if(this.questionList.indexOf(this.random) === -1 )
        this.questionList.push(this.random);
    }
    console.log(this.questionList)
    this.question = this.quiz[this.questionList[this.current]];
  }

  onCancel(){
    if(this.current > 0){
      this.warning();
    }
    else{
      this.router.navigateByUrl('/home');
    }
  }

  async warning(){
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Your progress will not be saved',
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'ok',
          handler: () =>{
            this.router.navigateByUrl('/home');
          }
        }
      ]
    });

    await alert.present();
  }

  getAnswer(i: number){
    this.answer = i;
  }

  next(){
    if(this.answer == this.question.answer){
      this.totalCorrect++;
    }
    if(this.current == 2){
      this.showResult();
    }
    else{
      this.current++;
      this.question = this.quiz[this.questionList[this.current]];
    }
  }

  async showResult(){
    this.userInfoLocal = this.achievementSvc.getLocalUser();
    this.userInfoLocal.point += this.totalCorrect * 50;
    this.userInfo = {
      password: this.userInfoLocal.password,
      point: this.userInfoLocal.point,
      quizCleared: this.userInfoLocal.quizCleared,
      totalBought: this.userInfoLocal.totalBought,
      totalSold: this.userInfoLocal.totalSold,
      userName: this.userInfoLocal.userName,
      phone: this.userInfoLocal.phone
    }
    console.log(this.achievementSvc.getLocalUserID());
    const alert = await this.alertController.create({
      header: 'Your Score',
      message: this.totalCorrect + ' of 3<br/>+ ' + this.totalCorrect * 50 + ' point',
      buttons: [
        {
          text: 'ok',
          handler: () =>{
            this.achievementSvc.updateUserPoint(this.userInfo , this.achievementSvc.getLocalUserID());
            this.router.navigateByUrl('/home');
          }
        }
      ]
    });

    await alert.present();
  }
}
