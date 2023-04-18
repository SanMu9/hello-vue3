class CityClass {
  constructor(domId){
    this.domId = domId

    // basic
    this.container = null,
    this.scene = null,
    this.camera = null,
  }

  initCanvas(){
    this.container = document.getElementById(this.domId)
  }
  initScene() {}
  

}