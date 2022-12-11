import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-movies',
  templateUrl: './show-movies.component.html',
  styleUrls: ['./show-movies.component.scss']
})
export class ShowMoviesComponent implements OnInit {

  Genre:string="";
  Search:string="";
  Movies:any[]=[];
  GenreMovies:any[]=[];
  admin:boolean=false;
  display:boolean=false;
  movieToDelete:string="";

  constructor(private http:HttpClient,private router:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("admin")!=undefined && localStorage.getItem("admin")!=null)
    {
      if(localStorage.getItem("admin").toString()=="true")
      this.admin=true;
      else
      this.admin=false;
    }
    const urlParams = new URLSearchParams(window.location.search);
    this.Genre = urlParams.get('genre');
    this.Search = urlParams.get('search');
    this.LoadMovies();
  }

  LoadMovies()
  {
    this.http.get("assets/moviesinfo.json").subscribe((response:any)=>{
      response.forEach((item:any)=>{
        item.Genre=item.Genre.split(',');
      })
      this.Movies=response;
      if(this.Genre!="")
      this.ExtractMovies(this.Movies)
      else
      this.SearchMovies(this.Movies)
    })
  }

  SearchMovies(Movies)
  {
    if(this.Search=="")
    {
      this.GenreMovies=Movies;
    }
    else
    {
      this.Search.toLowerCase
      Movies.forEach((item:any)=>{
        if((item.Title).toLowerCase().includes(this.Search.trim().toLowerCase()))
        {
          this.GenreMovies.push(item);
        }
      });
    }
    console.log(this.GenreMovies)
  }

  ExtractMovies(Movies)
  {
    console.log(Movies);
    if(this.Genre=="All")
    {
      this.GenreMovies=Movies;
    }
    else
    {
      Movies.forEach((item:any)=>{
        if((item.Genre).includes(this.Genre.trim()))
        {
          this.GenreMovies.push(item);
        }
      });
    }
    
    console.log(this.GenreMovies);
  }

  ShowMovieDetails(movie)
  {
    console.log(movie.Title);
    this.router.navigate(
      ['/movie-info'],
      { queryParams: { movie: movie.Title } }
    );
  }

  Delete(movie:string)
  {
    this.display=true;
    this.movieToDelete=movie
  }

  DeleteMovie()
  {
    console.log("Moie to be deleted :"+ this.movieToDelete)
    this.display=false;
  }
}
