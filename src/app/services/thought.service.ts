import { Injectable } from '@angular/core';
import { IThought } from '../models/thought.interface';
import { HttpClient } from '@angular/common/http';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class ThoughtService {

  constructor(
      private http: HttpClient,
      private envService: EnvService
  ) { }
  create( thought: IThought ) {
    return this.http.post(this.envService.API_URL, thought );
  }
}
