import { Injectable } from '@angular/core';
import * as Random from 'random-js';
import { Card, suits, values } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private engine = Random.browserCrypto;

  public cardBack = 'cardback.png';
  public dickMode = false;

  constructor() {
    this.resume();
    this.setDickMode(this.dickMode);
  }

  public setDickMode(b: boolean) {
    this.dickMode = b;

    if (b) {
      this.cardBack = 'cardback-au.png';
    } else {
      this.cardBack = 'cardback.png';
    }

    this.save();
  }

  private getOrderedCards(players: number): Card[] {
    const cards = [];

    for (let i = 0; i < players; i++) {
      for (const v of values) {
        cards.push(new Card(v, suits[i]));
      }
    }

    return cards;
  }

  private randInt(a: number, b: number): number {
    return Random.integer(a, b)(this.engine);
  }

  private swap(arr: any[], i: number, j: number) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  private shuffleWithSeed(arr: any[], seed: number[]) {
    const n = arr.length;
    if (seed.length + 1 !== n) {
      throw new Error('Lengths are wrong!');
    }

    for (let i = n - 1; i >= 1; i--) {
      const j = seed[n - 1 - i];
      this.swap(arr, i, j);
    }
  }

  private generateSeed(n: number): number[] {
    const seed = [];
    for (let i = n - 1; i >= 1; i--) {
      seed.push(this.randInt(0, i));
    }
    return seed;
  }

  public generateSeedForPlayers(players: number): number[] {
    return this.generateSeed(players * 13);
  }

  public generateCardsFromSeed(players: number, seed: number[]): Card[] {
    const cards = this.getOrderedCards(players);
    this.shuffleWithSeed(cards, seed);
    return cards;
  }

  public getSymbol(card: Card): string {
    switch (card.suit) {
      case 'S':
        return '♠';
      case 'C':
        return '♣';
      case 'H':
        return '♥';
      case 'D':
        return '♦';
      case 'A':
        return '☘';
      case 'I':
        return '🟊';
      default:
        return '';
    }
  }

  public getColor(card: Card): string {
    switch (card.suit) {
      case 'S':
        return '#000';
      case 'C':
        return '#000';
      case 'H':
        return '#e74c3c';
      case 'D':
        return '#e74c3c';
      case 'A':
        return '#2ecc71';
      case 'I':
        return '#2ecc71';
      default:
        return '';
    }
  }

  public reset() {
    this.dickMode = false;
  }

  public save() {
    localStorage.setItem('academy:dickMode', JSON.stringify(this.dickMode));
  }

  public resume() {
    this.dickMode = JSON.parse(localStorage.getItem('academy:dickMode')) || this.dickMode;
  }

}
