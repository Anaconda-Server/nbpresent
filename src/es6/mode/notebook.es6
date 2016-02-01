import Jupyter from "base/js/namespace";

import {d3, $} from "nbpresent-deps";

import {NotebookPresenter} from "../presenter/notebook";
import {Sorter} from "../sorter";
import {PART} from "../parts";
import {NbpresentTour} from "../tour";
import {Tree} from "../tree";

import {BaseMode} from "./base";

export class NotebookMode extends BaseMode {
  init() {
    this.initStylesheet();

    let tree = new Tree({
      slides: this.metadata().slides,
      root: this.root
    });

    this.tree = tree.tree;

    this.slides = this.tree.select(["slides"]);
    this.slides.on("update", () => this.metadata(true))

    this.tour = new NbpresentTour(this);
  }

  initStylesheet(){
    let css = d3.select("head")
      .selectAll("link#nbpresent-css")
      .data([1]);

    if(css.node()){
      console.warn("nbpresent extension already loaded!");
      return;
    }

    css.enter()
      .append("link")
      .attr({id: "nbpresent-css"})
      .attr({
        rel: "stylesheet",
        href: `${this.root}/nbpresent.min.css`
      });
  }

  metadata(update){
    let md = Jupyter.notebook.metadata;
    if(update){
      md.nbpresent = {
        slides: this.slides.serialize()
      };
    }else{
      return md.nbpresent || {
        slides: {}
      }
    }
  }

  show(){
    if(!this.sorter){
      this.sorter = new Sorter(this.tree, this.tour, this);
    }
    this.sorter.show();
    this.tour.start();
  }

  present(){
    if(!this.presenter){
      this.presenter = new NotebookPresenter(this.tree, this.tour);
    }
    this.presenter.presenting.set(true);
  }

  unpresent(){
    this.presenter.presenting.set(false);
  }
}
