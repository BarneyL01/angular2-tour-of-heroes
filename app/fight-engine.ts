import { Creature } from './creature';
import { Hero } from './hero';
// import { HeroService } from './hero.service';
import { Hit } from './hit';
import CreatureUtils from './creature-utils';
import HeroUtils from './hero-utils';
import GeneralUtils from './general-utils';
import {FightResult} from './fight-result';

export class FightEngine {
    creature1:Creature;
    creature2:Creature;
    // fightCommentary:Hit[];
    fightResult:FightResult;
    
    accuracyDice:number = 6;
    strengthDice:number = 6;
    
    creature1NextHit:number;
    creature2NextHit:number;
    
    swingTimer:number;
    fightTimerMax:number = 500;
    
    constructor(creature1:Creature, creature2:Creature){
        this.creature1 = creature1;
        this.creature2 = creature2;
    }
    
    fight():FightResult{
        this.swingTimer = 0;
        this.creature1NextHit = this.creature1.attackSpeed;
        this.creature2NextHit = this.creature2.attackSpeed;
        console.log('fight running, creature Death:', this.checkCreatureDeath());
        
        this.fightResult = {
                winner: null,
                loser: null,
                experienceGained:0, 
                resultTie: false,
                fightCommentary: []
        };
        
        // Put max on swingTimer so that this doesn't go stupid while I haven't fully tested
        for(this.swingTimer = 0; 
            this.swingTimer < this.fightTimerMax && !this.checkCreatureDeath(); 
            this.swingTimer++){
                
            // console.log(this.swingTimer);
            if(this.creature1NextHit == this.swingTimer){
                this.fightResult.fightCommentary.push(this.creatureAttack(this.creature1, this.creature2));
                this.creature1NextHit += this.creature1.attackSpeed;
            }
            
            if(this.creature2NextHit == this.swingTimer){
                this.fightResult.fightCommentary.push(this.creatureAttack(this.creature2, this.creature1));
                this.creature2NextHit += this.creature2.attackSpeed;
            }
        }
        
        
        
        // tie fight
        if(CreatureUtils.isDead(this.creature1) && 
                CreatureUtils.isDead(this.creature2))
        {
            // arbitrarily still set winner & loser
            this.fightResult.winner = this.creature1;
            this.fightResult.loser = this.creature2;
            
            this.fightResult.resultTie = true;
        }else{
                // creature 2 won.
            if(CreatureUtils.isDead(this.creature1)){
                this.fightResult.winner = this.creature2;
                this.fightResult.loser = this.creature1;
                this.fightResult.experienceGained = CreatureUtils.getExperienceIfKilled(this.creature1);                
            }else{
                // creature 1 won.
                this.fightResult.winner = this.creature1;
                this.fightResult.loser = this.creature2;
                this.fightResult.experienceGained = CreatureUtils.getExperienceIfKilled(this.creature2);
            }
            
            if(HeroUtils.isHero(this.fightResult.winner)){
                HeroUtils.updateExperience(<Hero>this.fightResult.winner, this.fightResult.experienceGained);
            }
        }
        return this.fightResult;
    }
    
    checkCreatureDeath(){
        return (CreatureUtils.isDead(this.creature1) || 
                CreatureUtils.isDead(this.creature2));
    }
    
    creatureAttack(attacker:Creature, defender:Creature):Hit{
        var damage:number;
        if(this.hitSucceed(attacker, defender)){
            damage = GeneralUtils.rollDice(this.strengthDice, attacker.strength);
            // update hp
            defender.hitPoints -= damage;
            
            return {attacker:attacker, 
                    defender: defender, 
                    hitConnected:true, 
                    damage:damage, 
                    remainingHp:defender.hitPoints };
        }else{
            return {attacker:attacker, 
                defender: defender, 
                hitConnected:false};
        }
    }
    
    updateHp(creature:Creature, damage:number){
        creature.hitPoints = Math.max(creature.hitPoints-damage, 0);
    }
    
    hitSucceed(attacker:Creature, defender:Creature):boolean{
        var attackRoll:number = GeneralUtils.rollDice(this.accuracyDice, attacker.dexterity);
        var defendRoll:number = GeneralUtils.rollDice(this.accuracyDice, defender.dexterity);
        // console.log('hitSucceed: ', attackRoll, ' against ', defendRoll);
        return (attackRoll > defendRoll);
    }
    
    
        
}