function inicijalizacija(){
    let napitci=[
        {naziv:"Espresso", cena:30, kolicina:50},
        {naziv:"Machiato",cena:40, kolicina:50},
        {naziv:"Kapuchino",cena:45, kolicina:50},
        {naziv:"Kapuchino with chocolate",cena:50, kolicina:50},
        {naziv:"Irish coffee",cena:70, kolicina:50},
        {naziv:"Irish coffee_strong",cena:75, kolicina:50},
        {naziv:"NES",cena:40, kolicina:50},
        {naziv:"Tea",cena:40, kolicina:50},
        {naziv:"Hot wather",cena:10, kolicina:50},
    ];
    localStorage.setItem("proizvodi", JSON.stringify(napitci));
}
// --------pokrenuti samo prilikom inicijalizacije programa---------//
// inicijalizacija();

let komande = document.querySelectorAll(".komande");
let inputi = document.querySelectorAll(".input");
let swich=0;

let kafemat={
    proizvodi:JSON.parse(localStorage.getItem("proizvodi")),
    stanje_proizvoda:function(){
        len=this.proizvodi.length;
        for(let i=0;i<len;i++){
            if(this.proizvodi[i].kolicina<10){
                komande[i].innerHTML += "<br>preostala kol. "+this.proizvodi[i].kolicina;
                komande[i].style.background = "#FF9D87";
            }
            if(this.proizvodi[i].kolicina<=0){
                komande[i].onclick='disabled';
            }
        }
    },
    panel:function(){
        let a=komande.length
        let display = document.querySelector("#priprema");
        let stanje = localStorage.getItem("kredit"), novo_stanje;
        for(let i=0;i<a;i++){
            komande[i].innerHTML = this.proizvodi[i].naziv +"  "+ this.proizvodi[i].cena;
            komande[i].onclick = function(){
                if(kafemat.proizvodi[i].cena>stanje || stanje=="NaN" || stanje=="null"){
                    display.style.visibility = "visible";
                    display.innerHTML = "Not enough credit !";
                    return;
                }
                if(komande[i].innerHTML==komande[i].innerHTML){
                    komande.forEach(el=>el.onclick='disabled');
                    display.style.visibility = "visible";
                    novo_stanje = stanje - kafemat.proizvodi[i].cena;
                    kafemat.proizvodi[i].kolicina--;
                    localStorage.setItem("proizvodi", JSON.stringify(kafemat.proizvodi));
                    localStorage.setItem("kredit", JSON.stringify(novo_stanje));
                    setTimeout(function(){
                        location.reload();
                    }, 5000);
                }
                setInterval(function(){
                    display.innerHTML = "Baverage ready 😊";
                },3000);
            }
        }                           
    },
    prikaz_stanja:function(){
        document.querySelector("#suma").focus();
        this.stanje=localStorage.getItem("kredit");
        if(this.stanje>=0)
            document.querySelector("#kredit").innerHTML = "Credit: "+this.stanje;
        else
            document.querySelector("#kredit").innerHTML = "Credit: "+0;
    },
    uplata:function(){
        let kredit = parseInt(document.querySelector("#suma").value);
        if(kafemat.stanje==="NaN" || kafemat.stanje==="undefined" || kafemat.stanje==='null'){
            kafemat.stanje=0;
        }
        let suma = parseInt(kafemat.stanje);
        suma +=kredit;
        localStorage.setItem("kredit", suma)
        location.reload();
    },
    kusur:function(){
        let kusur = localStorage.getItem("kredit");
        localStorage.setItem("kredit", 0);
        komande.forEach(el=>el.onclick='disabled');
        document.querySelector("#kredit").innerHTML = "Credit: "+0;
        if(kusur==="NaN" || kusur==="undefined" || kusur==0)
        document.querySelector(".kusur").innerHTML = "No change";
        else
        document.querySelector(".kusur").innerHTML = "Your change: "+kusur;
        setTimeout(()=>location.reload(),4000);
    },

    servis:function(){
        komande.forEach(el=>el.onclick='disabled');
        if(swich==0){
        document.querySelector(".servis").style.visibility = "visible";
        document.querySelector("#servis").style.background = "#FF9D87";
        inputi[0].focus();
        swich=1;
        return;
        }
        if(swich==1){
        document.querySelector(".servis").style.visibility = "hidden";
        swich=0;
        location.reload();
        return;
        }
    },
    dopuna:function(){
        a=this.proizvodi.length
        for(let i=0;i<a;i++){
            if(this.proizvodi[i].naziv.toLowerCase() == inputi[0].value.toLowerCase()){
                this.proizvodi[i].naziv = inputi[1].value.charAt(0).toUpperCase() + inputi[1].value.slice(1);
                this.proizvodi[i].cena = inputi[2].value
                this.proizvodi[i].kolicina = inputi[3].value
            }
        }
        localStorage.setItem("proizvodi", JSON.stringify(kafemat.proizvodi));
        inputi.forEach(el=>el.value="");
        inputi[0].focus();
    }
};

kafemat.panel();
kafemat.prikaz_stanja();
kafemat.stanje_proizvoda();

// taster za uplatu kredita
document.querySelector("#uplata").onclick = function(){
    let kredit = document.querySelector("#suma").value;
    if(kredit=='')
    return;
    kafemat.uplata();
    document.querySelector('#suma').value='';
};

// taster za kusur
document.querySelector("#kusur").onclick = function(){
    kafemat.kusur();
};

// taster za servis
document.querySelector("#servis").onclick = function(){
    kafemat.servis();
};

// taster za dopunu proizvoda
document.querySelector("#posalji").onclick = function(){
    kafemat.dopuna();
};


// console.log(kafemat.proizvodi);
