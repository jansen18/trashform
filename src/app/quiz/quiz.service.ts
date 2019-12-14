import { Injectable } from '@angular/core';
import { Quiz } from './quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private quiz: Quiz[] = [
    {
      question: 'Salah satu jenis sampah anorganik adalah...',
      choice1: 'daun kering',
      choice2: 'kaleng',
      choice3: 'sisa makanan',
      answer: 2
    },
    {
      question: 'Salah satu jenis sampah organik adalah...',
      choice1: 'batu',
      choice2: 'kaleng',
      choice3: 'sisa makanan',
      answer: 3
    },
    {
      question: 'Akibat membuang sampah tidak pada tempatnya dapat menimbulkan pencemaran lingkungan yang akan menimbulkan berbagai macam penyakit. Usaha untuk menanggulanginya adalah....',
      choice1: 'Mengelolah sampah untuk \npupuk kompos',
      choice2: 'Menimbun sampah plastik di dalam tanah',
      choice3: 'Mengolah sampah untuk makanan ternak',
      answer: 1
    },
    {
      question: 'Berdasarkan wujudnya limbah dibedakan dalam bentuk limbah... ',
      choice1: 'gas, cair, dan uap',
      choice2: 'berbahaya, semi, dan aman',
      choice3: 'padat, cair, dan gas',
      answer: 3
    },
    {
      question: 'Polutan di udara dapat menyebabkan terjadinya...',
      choice1: 'pencemaran udara',
      choice2: 'hujan asam',
      choice3: 'kerusakan lapisan ozon',
      answer: 1
    }
  ]

  constructor() { }

  getQuestion(){
    return[...this.quiz]
  }

}
