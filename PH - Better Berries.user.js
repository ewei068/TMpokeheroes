// ==UserScript==
// @name         PH - Better Berries
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  this part of the site is so unpolished holy shit
// @author       You
// @match        https://pokeheroes.com/berrygarden*
// @match        https://pokeheroes.com/toolshed*
// @grant        none
// ==/UserScript==

var userName = "reaperkun"

if(window.location == "https://pokeheroes.com/berrygarden") {

    document.getElementById('garden_loader').insertAdjacentHTML("beforebegin","<br><button id='waterall'>Water all</button> ")
    document.getElementById("waterall").addEventListener("click", waterAll)

    document.getElementById('garden_loader').insertAdjacentHTML("beforebegin","<button id='plantall'>Plant all</button> ")
    document.getElementById("plantall").addEventListener("click", plantAll)

    if (document.getElementsByClassName("userbar")[0].textContent = userName) {
        document.getElementById('garden_loader').insertAdjacentHTML("beforebegin","<button id='selectRawst'>Rawst Lvl. 1</button> ")
        document.getElementById("selectRawst").addEventListener("click", selectRawst)
    }

}

if(window.location == "https://pokeheroes.com/toolshed") {
    var seedMakerBerries = document.querySelectorAll("[data-level]")
    console.log(seedMakerBerries)
    document.getElementById("seedMakerBerryBag").insertAdjacentHTML("beforeend","<button id='maxberries'>Maximize berries</button> ")
    document.getElementById("maxberries").addEventListener("click", maxBerries)
    document.querySelector("[style='display: flex; flex-wrap: wrap; justify-content: center']").insertAdjacentHTML('afterend', '<button id="collectseeds">Collect all seeds</button>')
    document.getElementById("collectseeds").addEventListener("click", collectSeeds)
    if (document.getElementsByClassName("userbar")[0].textContent = userName) {
        document.querySelector("[style='display: flex; flex-wrap: wrap; justify-content: center']").insertAdjacentHTML('afterend', '<button id="fillrawst">Fill With Rawsts</button>')
        document.getElementById("fillrawst").addEventListener("click", justForReaper)
    }

}

function justForReaper(){
    var seedMakerCap1 = parseInt(document.getElementsByClassName("seedMakerDesc0")[0].innerHTML.match(/(\d*) Berries/)[1])
    $("<div>").load("includes/ajax/berrygarden/fillSeedMaker.php", {
        'berries': "Rawst",
        'amount': seedMakerCap1,
        'level': 1,
        'maker': 0
    }, function() {
        $("#prodQueue" + 1 + " .innerProd").append($(this).html());
        $("#prodQueue" + 1 + " .noBerryInserted").remove();
    });
    var seedMakerCap2 = parseInt(document.getElementsByClassName("seedMakerDesc1")[0].innerHTML.match(/(\d*) Berries/)[1])
    $("<div>").load("includes/ajax/berrygarden/fillSeedMaker.php", {
        'berries': "Rawst",
        'amount': seedMakerCap2,
        'level': 1,
        'maker': 1
    }, function() {
        $("#prodQueue" + 2 + " .innerProd").append($(this).html());
        $("#prodQueue" + 2 + " .noBerryInserted").remove();
    });
    var seedMakerCap3 = parseInt(document.getElementsByClassName("seedMakerDesc2")[0].innerHTML.match(/(\d*) Berries/)[1])
    $("<div>").load("includes/ajax/berrygarden/fillSeedMaker.php", {
        'berries': "Rawst",
        'amount': seedMakerCap3,
        'level': 1,
        'maker': 2
    }, function() {
        $("#prodQueue" + 3 + " .innerProd").append($(this).html());
        $("#prodQueue" + 3 + " .noBerryInserted").remove();
    });


}

function selectRawst() {
    selectSeed("Rawst", 1)
}

function collectSeeds() {
    claimSeed(0)
    claimSeed(1)
    claimSeed(2)
}
function maxBerries() {
    try{
        var maxQueue = parseInt(document.querySelector("[style='margin-bottom: 12px;']").innerHTML.match(/(\d*) Berries/)[1])
        } catch(err) { if (err.name == "TypeError") {
            maxQueue = parseInt(document.querySelector("[style='margin-bottom: 12px; display: block;']").innerHTML.match(/(\d*) Berries/)[1])
        } else {throw err}
                     }
    var curQueue = 0
    var seedMakerBerries = document.querySelector("[style='font-size: 8pt; display: block;']").parentNode
    for (var i = seedMakerBerries.children.length-1; i>1; i--) {
        if (curQueue < maxQueue) {
            if (parseInt(seedMakerBerries.children[i].children[0].textContent) < maxQueue) { //.children[0] is current number of berries owned
                seedMakerBerries.children[i].children[1].value = parseInt(seedMakerBerries.children[i].children[0].textContent) //sets input field to current owned berry number
                curQueue += seedMakerBerries.children[i].children[1].value
            } else {
                seedMakerBerries.children[i].children[1].value = maxQueue - curQueue
                curQueue += seedMakerBerries.children[i].children[1].value
            }
        }
    }
}

function waterAll() {
    var berries = document.querySelectorAll('[data-plantid]')
    for (var i = 0; i<berries.length; i++) {
        berries[i] = $(berries[i])
        waterPlant($(berries[i]))
    }
}

function plantAll() {
    if(selSeed == "") { window.alert("Select a seed first.") } else {
        for (var i = 0; i<gardenCoor[garden].length; i++) {
            clickOnGarden(gardenCoor[garden][i][0],gardenCoor[garden][i][1])
        }
    }
}


function plantAction(e) {
    e = $(e);
    if (tool_sel == null) {
        plantDetail(e);
    } else if (tool_sel == "water1") {
        masswaterPlant(e);
    } else if (tool_sel == "water2") {
        massWaterPlant(e);
    } else if (tool_sel == "mulch") {
        mulchBerry(e, selMulch);
    }
}

function massWaterPlant(e) {
    var ground = $(".dryGround" + e.data("plantid"));
    if (ground.length > 0) {
        waterPlant(e);
        var plantid = e.data("plantid");
        for (var i = 0; i < gardenCoor[garden].length; i++) {
            if (i != plantid) {
                if (gardenCoor[garden][plantid][1] == gardenCoor[garden][i][1]) {
                    if (((gardenCoor[garden][plantid][0] - 15) == gardenCoor[garden][i][0]) || ((gardenCoor[garden][plantid][0] + 15) == gardenCoor[garden][i][0])) {
                        massWaterPlant($(".plantIcon[data-plantid=" + i + "]"));
                    }
                }
            }
        }
    }
}

function selectWateringCan(w) {
    if (chooseTool(w)) {
        if (w == "water1") {
            addSelectedToolView("<img src='//staticpokeheroes.com/img/items/squirtbottle.png' style='float: left; margin-right: 8px'>Watering Can");
            massWaterPlant()
        } else {
            addSelectedToolView("<img src='//staticpokeheroes.com/img/items/wailmer-pail.png' style='float: left; margin-right: 8px'>Watering Can");
            massWaterPlant()
        }
    }
}