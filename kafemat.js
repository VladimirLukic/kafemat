function inicijalizacija(){
    let napitci=[
        {naziv:"ESPRESSO", cena:30, kolicina:50},
        {naziv:"MACHIATO",cena:40, kolicina:50},
        {naziv:"KAPUCHINO",cena:45, kolicina:50},
        {naziv:"KAPUCHINO CHOCOLATE",cena:50, kolicina:50},
        {naziv:"IRISH COFFE",cena:70, kolicina:50},
        {naziv:"IRISH COFFE - STRONG",cena:75, kolicina:50},
        {naziv:"NES",cena:40, kolicina:50},
        {naziv:"TEA",cena:40, kolicina:50},
        {naziv:"HOT WATHER",cena:10, kolicina:50},
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
        // let solja = document.createElement('IMG');
        // solja.src='solja.jpg';
        // solja.width='20px';
        for(let i=0;i<a;i++){
            komande[i].innerHTML = this.proizvodi[i].naziv +"  "+ this.proizvodi[i].cena;
            komande[i].onclick = function(){
                if(kafemat.proizvodi[i].cena>stanje || stanje=="NaN" || stanje=="null"){
                    display.style.visibility = "visible";
                    document.querySelector("#kredit").style.visibility = 'hidden';
                    display.innerHTML = "NOT ENOUGH CREDIT!";
                    setTimeout(function(){
                        display.style.visibility = "hidden";
                        document.querySelector("#kredit").style.visibility = 'visible';
                        },3000);
                    return;
                }
                if(komande[i].innerHTML==komande[i].innerHTML){
                    komande.forEach(el=>el.onclick='disabled');
                    display.style.visibility = "visible";
                    display.innerHTML = `PREPARING<br>PLEASE WAIT...`;
                    // display.append(solja);
                    document.querySelector("#kredit").style.display = 'none';
                    novo_stanje = stanje - kafemat.proizvodi[i].cena;
                    kafemat.proizvodi[i].kolicina--;
                    localStorage.setItem("proizvodi", JSON.stringify(kafemat.proizvodi));
                    localStorage.setItem("kredit", JSON.stringify(novo_stanje));
                    setTimeout(function(){
                        location.reload();
                    }, 7000);
                }
                setInterval(function(){
                    display.innerHTML = "BAVERAGE READY 😊";
                },3000);
            }
        }                           
    },
    prikaz_stanja:function(){
        document.querySelector("#suma").focus();
        this.stanje=localStorage.getItem("kredit");
        if(this.stanje>=0)
            document.querySelector("#kredit").innerHTML = "CREDIT  "+this.stanje;
        else
            document.querySelector("#kredit").innerHTML = "CREDIT  "+0;
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
        document.querySelector("#kredit").innerHTML = "CREDIT "+0;
        if(kusur==="NaN" || kusur==="undefined" || kusur==0)
        document.querySelector(".kusur").innerHTML = "NO CHANGE";
        else
        document.querySelector(".kusur").innerHTML = "YOUR CHANGE: "+kusur;
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
                this.proizvodi[i].naziv = inputi[1].value.toUpperCase();
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
document.querySelector("#posalji").onclick = function(event){
    kafemat.dopuna();
};


// console.log(kafemat.proizvodi);
