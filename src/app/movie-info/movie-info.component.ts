import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss']
})
export class MovieInfoComponent implements OnInit {

  movie:string="";
  movieinfo:any;
  rating:number;
  Name:string="";
  Comment:string="";
  Userloggedin:boolean=false;

  constructor(private http:HttpClient,private messageService: MessageService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Userloggedin")!=undefined)
    {
      this.Userloggedin=true;
    }
    const urlParams = new URLSearchParams(window.location.search);
    this.movie = urlParams.get('movie');
    console.log(this.movie);
    
    this.LoadMovieDetails();
  }

  LoadMovieDetails()
  {
    this.http.get("assets/moviesinfo.json").subscribe((response:any)=>{
      
      response.forEach((item:any)=>{
        item.Genre=(item.Genre).split(",");
        item.Language=(item.Language).split(",");
        item.Country=(item.Country).split(",");
        item.Director=(item.Director).split(",");
        item.Writer=(item.Writer).split(",");
        item.Actors=(item.Actors).split(",");


        if((item.Title).trim()===this.movie)
        {
          console.log(item);
          this.movieinfo=item;
        }
      })
    })
  }

  SubmitReview(title:string)
  {
    this.clear();
    console.log(this.Comment+" "+this.rating+" "+this.Name+" "+title);

    var review={
      name:this.Name,
      rating:this.rating,
      comment:this.Comment
    }
    this.http.get("assets/moviesinfo.json").subscribe((response:any)=>{
      
      response.forEach((item:any)=>{
        if((item.Title).trim()===title)
        {
          (item.Reviews).push(review)
        }
        
      })
    })
    this.ShowToast();
  }

  ShowToast() {
    this.messageService.add({severity:'success', summary:'Review is submitted for approval'});
}

clear() {
        this.messageService.clear();
    }

}
