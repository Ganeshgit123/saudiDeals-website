import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCallService } from './api-call.service';
const TOKEN_HEADER_KEY = 'Authorization'; 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: ApiCallService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = req;
    const token = this.authService.getToken();
    if (token != null) {
      authReq = req.clone({
              // setHeaders: {
              //     Token: "" + token
              // }
              headers: req.headers.set(TOKEN_HEADER_KEY, token)
          });
        }
    // console.log("auth",authReq)
    return next.handle(authReq);
  }
    // return next.handle(request);
  }

