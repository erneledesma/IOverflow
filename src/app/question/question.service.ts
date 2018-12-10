import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { Answer } from '../answer/answer.model';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import urljoin from 'url-join';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class QuestionService {

  private questionsUrl: string;

  constructor(private http: Http) {
    this.questionsUrl = urljoin(environment.apiUrl, 'questions');
  }
// accededomos a la API  Question
  getQuestions(sort = '-createdAt'): Promise<void | Question[]> {
    return this.http.get(`${this.questionsUrl}?sort=${sort}`)
              .toPromise()
              .then(response => response.json() as Question[])
              .catch(this.handleError);
  }

  getQuestion(id): Promise<void | Question> {
    const url = urljoin(this.questionsUrl, id);
    return this.http.get(url)
            .toPromise()
            .then(response => response.json() as Question)
            .catch(this.handleError);
  }
    // declaramos los token para que validen a los usuarios conectados y registrados a realizar preguntas y respeustas
  getToken() {
    const token = localStorage.getItem('token');
    return `?token=${token}`;
  }
  //Obtenemos el token
  addQuestion(question: Question) {
    const body = JSON.stringify(question);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = this.getToken();
  // url para pegarle de los endpoint
    return this.http.post(this.questionsUrl + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }
// creamos las respuestas
  addAnswer(answer: Answer) {
    // creamos un objeto  para menejar las respuestas de una mejor manera en el backend
    const a = {
      description: answer.description,
      question: {
        _id: answer.question._id
      }
    };

    const body = JSON.stringify(a);// Enviamos el objeto que creamos - de esta forma el body no queda sobrecargado de todas las respuestas
    const headers = new Headers({ 'Content-Type': 'application/json' });
    //const idString = answer.question._id.toString();
    const url = urljoin(this.questionsUrl, answer.question._id, 'answers');
    const token = this.getToken();

    return this.http.post(url + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  handleError(error: any) {
    const errMsg = error.message ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg);
  }
}
