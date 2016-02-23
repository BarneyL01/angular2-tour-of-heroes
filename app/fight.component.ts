import { Component} from 'angular2/core';
import { NgClass } from 'angular2/common';

import { Hero } from './hero';
import { Creature } from './creature';
import { Dungeon } from './dungeon';

import { Hit } from './hit';
import { FightEngine } from './fight-engine';
import {FightResult} from './fight-result';
import HeroUtils from './hero-utils';
import CreatureUtils from './creature-utils'
import DungeonUtils from './dungeon-utils'

@Component({
  selector: 'fight-component',
  templateUrl : 'app/fight.component.html',
  directives: [NgClass, FightComponent],
  styleUrls: ['app/fight.component.css']
})

export class FightComponent{
    // fightCommentarys:Hit[] = [];
    fightEngine:FightEngine;
    fightResults:FightResult[] = [];
    
    creature1:Creature;
    creature2:Creature;
    
    fightError:boolean;
    fightStarted:boolean=false;
    
    fightType:string = "Fight";
    
    constructor() {
    }
    
    setFightType(fightType:string):void{
        this.fightType = fightType;
    }
    
    startFight(creature1:Creature, creature2:Creature):FightResult{
        this.creature1 = creature1;
        this.creature2 = creature2;
        
        this.fightError = (this.creature1 == null || this.creature2 == null);
        if(this.fightError) return;
        this.fightError = (this.creature1.id == null || this.creature2.id == null);
        if(this.fightError) return;
        
        this.fightStarted = true;
        this.fightEngine = new FightEngine(creature1, creature2);
        
        var newFightResults:FightResult = this.fightEngine.fight()
        this.fightResults.push(newFightResults);
        return newFightResults;
    }
    
    resetFights(){
        this.fightResults = [];
    }
}