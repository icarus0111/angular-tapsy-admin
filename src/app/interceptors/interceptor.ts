import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Injectable} from "@angular/core";
import { HelpermethodsService } from '../services/helpermethods.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private helper: HelpermethodsService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token');
    console.log('request data : .........', request.url.includes('/uploadImage'));

    if (token) {
      token =  this.helper.decryptData(token);
      // console.log('interceptor token : .........', token);       
      request = request.clone({
        // setHeaders: { authorization: `Bearer ${token}` }
        headers: new HttpHeaders({
          // 'Content-Type':  'application/json',
          'authorization': `Bearer ${token}`
        })
      });
    }

    if (request.method.toLowerCase() === 'post' && !request.url.includes('/uploadImage')) {
      request =  request.clone({
        body: {
            TAP_REQ: this.helper.encryptDataFromRequest(request.body)
        }
      })         
    }
  
    return next.handle(request);
  }


}