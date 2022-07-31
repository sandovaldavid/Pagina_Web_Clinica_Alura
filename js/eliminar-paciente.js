
var pacientes = document.querySelectorAll(".paciente");

var tabla = document.querySelector("#tabla-pacientes");
tabla.addEventListener("dblclick",function(event){//this.  ---> es el dueño del evento 
    event.target.parentNode.classList.add("fadeOut");
    setTimeout(function(){
        event.target.parentNode.remove(); 
    },500);
    //event.target.parentNode.remove();      //  es donde se ejecuto el evento 
    // parentNode ---> subir una gerarquia, lo que quiere decir que ya no te elimina el td, ahora te eliminara el tr

});

/*
pacientes.forEach(function(paciente){
    paciente.addEventListener("dblclick", function(){
        this.remove();
    })
});
*/

/*
var tabla = document.querySelector("#tabla-pacientes");

tabla.addEventListener("dblclick",function(event){
    event.target.parentNode.classList.add("fadeOut");
    setTimeout(function(){
        event.target.parentNode.remove();    
    },500);
}); 
*/