

function Resource(displayDiv){
	this.amount=0;
	this.displayElement=displayDiv
	this.onUpdate() //init display
}
Resource.prototype={}
Resource.prototype.onUpdate=function(){
	this.displayElement.textContent=this.amount;
}
Resource.prototype.income=function(amount){
	this.amount+=amount;
	this.onUpdate()
}
Resource.prototype.spend=function(amount){
	if(amount>this.amount){
		return false;
	}
	this.amount-=amount;
	this.onUpdate()
	return true;	
}

var lemons=null;
var money=null
var towers=null
var customer=null

function Lemonade(displayDiv){
	Resource.call(this, displayDiv)
	this.totalIncome=0;
}
Lemonade.prototype=Object.create(Resource.prototype);
Lemonade.prototype.income=function(amount){
	Resource.prototype.income.call(this, amount)
	this.totalIncome+=amount
	var cusDelta=Math.floor(this.totalIncome/10) - customer.amount
	if( cusDelta > 0){
		customer.income(cusDelta)
	}
}



function Customer(displayDiv){
	Resource.call(this, displayDiv)
	this.remainingConversions=0;
}
Customer.prototype=Object.create(Resource.prototype)
Customer.prototype.tick=function(delta){
	var conversions = this.remainingConversions + (delta/(3000/this.amount))
	var wholeConversions=Math.floor(conversions);
	this.remainingConversions = conversions - wholeConversions
	if(lemons.amount<wholeConversions){
		wholeConversions=lemons.amount		
	}
	lemons.spend(wholeConversions)
	money.income(wholeConversions)
}

function Tower(displayDiv){
	Resource.call(this, displayDiv)
	this.remainderTime=0;
	this.cost=1
}
Tower.prototype=Object.create(Resource.prototype)
Tower.prototype.tick=function(delta){
	delta=delta+this.remainderTime
	var wholeSeconds=Math.floor(delta/1000)
	this.remainderTime = delta - (wholeSeconds*1000)
	lemons.income(wholeSeconds*this.amount)
}


function mainLoop(delta){
	customer.tick(delta)
	towers.tick(delta)
}

var lastRun=0;
var throttleTime=1000
function loopThrottle(timestamp){
	var delta=timestamp-lastRun
	if( delta > throttleTime){
		mainLoop(delta)
		lastRun=timestamp
	}
	window.requestAnimationFrame(loopThrottle);
}




function init(){
	
	lemons=new Lemonade(document.getElementById("lemonQty"))
	money=new Resource(document.getElementById("moneyQty"))
	towers=new Tower(document.getElementById("towersQty"))
	customer=new Customer(document.getElementById("customerQty"))

	document.getElementById("glassImg").onclick=function(){
		lemons.income(1)
	}
	document.getElementById("buyTower").onclick=function(){
		if(money.spend(100)){
			towers.income(1)
		}
	}
	window.requestAnimationFrame(loopThrottle);
}