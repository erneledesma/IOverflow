import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Answer } from './answer.model';
import { User } from '../auth/user.model';
import { Question } from '../question/question.model';
import { QuestionService } from '../question/question.service';
import SweetScroll from 'sweet-scroll';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
//Enviando una respuesta hacia el Backend
@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styles: [`
    form {
      margin-top: 20px;
    }
  `],
  providers: [QuestionService]
})
export class AnswerFormComponent {
  //Metodo para cuando el usuario envia datos de un formulario - recibe un formulario
  @Input() question: Question;
  sweetScroll: SweetScroll;

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private router: Router
  ) {
    this.sweetScroll = new SweetScroll();
  }

  onSubmit(form: NgForm) {
    // verificamos si el usuario no  esta logeado para que pueda ingresar
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/signin');
    }
    //console.log("esto es una respuesta")

// Creamos un objeto respeusta para bindiar
    const answer = new Answer(
      form.value.description,
      this.question
    );
    //llamamos al servicio de preguntas al metodo de addAnswer
    this.questionService
      .addAnswer(answer)
      .subscribe(
        a => {
          // este "a" nos llega del backend
          this.question.answers.unshift(a);
          this.sweetScroll.to('#title');
        },
        this.authService.handleError
      );
    form.reset();// nos subscribimos a la respuesta
  }
}
