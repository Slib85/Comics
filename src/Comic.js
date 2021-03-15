//let axios = require('axios');
//let express = require("express");
//let app = express()
import './Comic.css';
import React from 'react';

class Pagination extends React.Component {
    constructor() {
        super()
        
        this.maxPaginationToShow = 7;
    }

    render() {
        var paginationList = [];

        var minPage = Math.max(Math.min(this.props.activePage + Math.floor(this.maxPaginationToShow / 2), this.props.maxPageNumber) - this.maxPaginationToShow + 1, 1);
        var maxPage = Math.min(Math.max(this.props.activePage - Math.floor(this.maxPaginationToShow / 2), 1) + this.maxPaginationToShow - 1, this.props.maxPageNumber);

        for (var i = minPage; i <= maxPage; i++) {
            paginationList.push(i);
        }

        var contents = paginationList.map(value => {
            if (this.props.activePage === value) {
                return (
                    <li key={value} className="active">{value}</li> 
                )
            } else {
                return (
                    <li key={value} onClick={this.props.loadComic}>{value}</li>
                ) 
            }
        })

        
        return (
            <div className="pagination">
                <div onClick={this.props.loadPreviousComic}>{"<"}<span> Prev</span></div>
                <ul>
                    {contents}
                </ul>
                <div onClick={this.props.loadNextComic}><span>Next </span>{">"}</div>
            </div>
        )
    } 
}

class Comic extends React.Component {
    constructor() {
        super()

        this.state = {
            activePage: undefined,
            comicJSON: undefined
        };
        // Once we get the json from XKCD, we can find the latest one and call that to find the number.  Should be done dynamically.
        this.maxPageNumber = 1;

        this.fetchJSON(this.state.activePage)
    }

    fetchJSON = (pageNumber) => {
        var fetchUrl = typeof pageNumber === "undefined" ? "https://cors-anywhere.herokuapp.com/https://xkcd.com/info.0.json" : "https://cors-anywhere.herokuapp.com/https://xkcd.com/" + (this.maxPageNumber - pageNumber + 1) + "/info.0.json"

        console.log(this.state.activePage);
        fetch(fetchUrl)
        .then((response) => response.json())
        .then((result) => {
            if (typeof pageNumber === "undefined") {
                this.maxPageNumber = result.num                
            }

            this.setState({
                activePage: (typeof pageNumber !== "undefined" ? pageNumber : 1),
                comicJSON: result
            });
        }, (error) => {
            console.log(error);
        })
    }

    setActivePage = (pageNumber) => {
        if (pageNumber < 1) {
            pageNumber = 1;
        }

        this.setState({
            comicJSON: undefined
        });
        
        this.fetchJSON(pageNumber)
    }

    loadPreviousComic = () => {
        this.setActivePage(this.state.activePage - 1)
    }

    loadNextComic = () => {
        this.setActivePage(this.state.activePage +1)
    }

    loadComic = (e) => {
        this.setActivePage(parseInt(e.target.innerHTML))
    }

    render() {
        if (typeof this.state.comicJSON === "undefined") {
            return (
                <div className="comic">
                    <div>Loading...</div>
                </div>
            )
        } else {
            return (
                <div className="comic">
                    <div>{this.state.comicJSON.year}-{this.state.comicJSON.month}-{this.state.comicJSON.day}</div>
                    <h1>{this.state.comicJSON.title}</h1>
                    <Pagination activePage={this.state.activePage} loadPreviousComic={this.loadPreviousComic} loadNextComic={this.loadNextComic} maxPageNumber={this.maxPageNumber} loadComic={this.loadComic} />
                    <img src={this.state.comicJSON.img} alt={this.state.comicJSON.alt} />
                    <Pagination activePage={this.state.activePage} loadPreviousComic={this.loadPreviousComic} loadNextComic={this.loadNextComic} maxPageNumber={this.maxPageNumber} loadComic={this.loadComic} />
                </div>
            )
        }
    }
}

export default Comic;