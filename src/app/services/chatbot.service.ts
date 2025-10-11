import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private knowledgeBase = {
    greetings: {
      keywords: ['hello', 'hi', 'hey', 'hola', 'good morning', 'good afternoon', 'good evening'],
      responses: [
        '¡Hola! Welcome to Cafeteria Lulu! How can I help you today?',
        'Hi there! I\'m here to help. What would you like to know?',
        'Hello! Welcome! Feel free to ask me about our products, hours, or anything else!'
      ]
    },
    products: {
      keywords: ['product', 'menu', 'food', 'drink', 'coffee', 'what do you have', 'what do you sell'],
      responses: [
        'We offer a variety of delicious items! Visit our Products page to see our full menu including coffee, pastries, sandwiches, and more. You can browse and add items to your cart!',
        'Our menu includes fresh coffee, tasty pastries, sandwiches, and beverages. Check out the Products section to see everything we offer!'
      ]
    },
    hours: {
      keywords: ['hours', 'open', 'close', 'when', 'time', 'schedule'],
      responses: [
        'Cafeteria Lulu is typically open Monday-Friday 7:00 AM - 6:00 PM, and weekends 8:00 AM - 4:00 PM. Please check with us for holiday hours!',
        'We\'re open Monday-Friday from 7 AM to 6 PM, and weekends 8 AM to 4 PM. Come visit us!'
      ]
    },
    order: {
      keywords: ['order', 'buy', 'purchase', 'cart', 'checkout', 'how to order'],
      responses: [
        'To place an order: 1) Browse our Products page, 2) Add items to your cart, 3) Click the cart icon to review, 4) Complete checkout. You\'ll need to be logged in!',
        'Simply browse our products, add what you like to your cart, and checkout when ready. Make sure you\'re logged in to complete your purchase!'
      ]
    },
    account: {
      keywords: ['account', 'register', 'login', 'sign up', 'sign in', 'password'],
      responses: [
        'You can create an account by clicking "Register" in the menu. If you already have an account, just click "Login". This lets you place orders and track your purchases!',
        'To create an account, click the Register link. Already have one? Use the Login button. Your account lets you order and manage your preferences!'
      ]
    },
    location: {
      keywords: ['location', 'address', 'where', 'find you', 'directions'],
      responses: [
        'Cafeteria Lulu is conveniently located on campus. For specific directions, please contact us or check our Home page for more details!',
        'We\'re located on campus! Visit our Home page for more information about how to find us.'
      ]
    },
    payment: {
      keywords: ['payment', 'pay', 'credit card', 'cash', 'how to pay'],
      responses: [
        'We accept various payment methods including credit cards, debit cards, and cash. Online orders can be paid through our secure checkout process!',
        'You can pay with credit/debit cards or cash. Our online checkout is secure and easy to use!'
      ]
    },
    help: {
      keywords: ['help', 'support', 'problem', 'issue', 'question'],
      responses: [
        'I\'m here to help! You can ask me about: our products, hours, how to order, account registration, location, or payment methods. What would you like to know?',
        'I can help with questions about our menu, operating hours, ordering process, accounts, and more. What do you need help with?'
      ]
    },
    thanks: {
      keywords: ['thank', 'thanks', 'gracias', 'appreciate'],
      responses: [
        'You\'re very welcome! Enjoy your visit to Cafeteria Lulu! ☕',
        'My pleasure! Have a great day! 😊',
        'Happy to help! Come back anytime!'
      ]
    },
    goodbye: {
      keywords: ['bye', 'goodbye', 'see you', 'adios', 'later'],
      responses: [
        'Goodbye! Come back soon to Cafeteria Lulu! ☕',
        'See you later! Enjoy your day! 👋',
        'Bye! Looking forward to serving you again!'
      ]
    },
    agent: {
      keywords: ['agent', 'person', 'human'],
      responses: [
        'Right now we are only robots in the cafeteria, sadly human agents are not available at the moment',
        'Puff imagine that, a real person? Sorry, we are only robots at the moment',
        'I can pretent to be a person, but really I am a toaster... Just kidding! I am actually a microwave'
      ]
    }
  };

  constructor() {
    // Add initial welcome message
    this.addMessage('Hello! Welcome to Cafeteria Lulu! 👋 I\'m your virtual assistant. How can I help you today?', true);
  }

  addMessage(text: string, isBot: boolean): void {
    const currentMessages = this.messagesSubject.value;
    const newMessage: ChatMessage = {
      text,
      isBot,
      timestamp: new Date()
    };
    this.messagesSubject.next([...currentMessages, newMessage]);
  }

  processUserMessage(message: string): void {
    // Add user message
    this.addMessage(message, false);

    // Process and respond
    setTimeout(() => {
      const response = this.generateResponse(message);
      this.addMessage(response, true);
    }, 500); // Small delay to simulate thinking
  }

  private generateResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Check each category in knowledge base
    for (const [_, data] of Object.entries(this.knowledgeBase)) {
      for (const keyword of data.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          // Return a random response from matching category
          const responses = data.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }

    // Default response if no match found
    const defaultResponses = [
      'I\'m not sure about that, but I can help you with information about our products, hours, ordering, or account setup. What would you like to know?',
      'That\'s an interesting question! I can tell you about our menu, operating hours, how to place orders, or help with your account. What interests you?',
      'Hmm, I don\'t have a specific answer for that. Try asking me about our products, hours, payment options, or how to order!',
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
    // Add welcome message again
    this.addMessage('Hello! Welcome to Cafeteria Lulu! 👋 I\'m your virtual assistant. How can I help you today?', true);
  }

  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }
}

