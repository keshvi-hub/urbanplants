import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.html',
  imports: [FormsModule, NgFor, NgIf],
  styleUrls: ['./chatbot.css']
})
export class ChatbotComponent {

  @ViewChild('chatBody') chatBody!: ElementRef;

  isOpen = false;
  userMessage = '';

  messages: any[] = [
    { sender: 'Bot', text: 'Hello! Welcome to Urban Plants. How can I help you with plants and seeds today?' }
  ];

  quickReplies = [
    'How to care for plants?',
    'Best seeds for beginners',
    'Watering tips',
    'Organic fertilizers'
  ];

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) setTimeout(() => this.scrollToBottom(), 100);
  }

  sendQuickReply(msg: string) {
    this.userMessage = msg;
    this.sendMessage();
  }

  sendMessage() {
    if (this.userMessage.trim() === '') return;
    this.messages.push({ sender: 'You', text: this.userMessage });
    this.scrollToBottom();
    const input = this.userMessage.toLowerCase();
    this.userMessage = '';
    this.messages.push({ sender: 'Bot', text: this.getBotReply(input) });
    setTimeout(() => this.scrollToBottom(), 50);
  }

  scrollToBottom() {
    try {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    } catch (e) {}
  }

  getBotReply(msg: string): string {
    if (msg.includes('care') || msg.includes('maintain') || msg.includes('look after') ||
        msg.includes('how to grow') || msg.includes('growing tips') || msg.includes('take care')) {
      return 'Plant Care Tips: Water regularly but do not overwater. Ensure proper sunlight. Use well-draining soil. Fertilize monthly during growing season. Prune dead leaves regularly.';
    }
    if (msg.includes('water') || msg.includes('irrigation')) {
      return 'Watering Tips: Water early morning or evening. Check soil moisture before watering. Most plants need 1-2 inches per week. Avoid wetting leaves to prevent disease.';
    }
    if (msg.includes('seed') || msg.includes('germination') || msg.includes('sowing')) {
      return 'Seed Growing Tips: Start with quality seeds. Use seed starting mix. Keep soil moist but not soggy. Provide warmth. Transplant when 2-3 true leaves appear.';
    }
    if (msg.includes('fertilizer') || msg.includes('nutrient') || msg.includes('compost')) {
      return 'Fertilizer Guide: Use organic compost for best results. NPK ratio 10-10-10 for general use. Apply every 4-6 weeks during growing season. Avoid over-fertilizing.';
    }
    if (msg.includes('pest') || msg.includes('insect') || msg.includes('bug')) {
      return 'Pest Control: Use neem oil spray as an organic solution. Introduce beneficial insects. Remove affected leaves. Maintain plant health. Avoid chemical pesticides.';
    }
    if (msg.includes('soil') || msg.includes('potting mix')) {
      return 'Soil Tips: Use well-draining potting mix. Add perlite for better drainage. pH level 6.0-7.0 for most plants. Mix in compost for nutrients. Refresh soil annually.';
    }
    if (msg.includes('sun') || msg.includes('light') || msg.includes('shade')) {
      return 'Sunlight Requirements: Full sun needs 6-8 hours direct sunlight. Partial shade needs 3-6 hours. Full shade needs less than 3 hours. Rotate plants for even growth.';
    }
    if (msg.includes('indoor') || msg.includes('houseplant')) {
      return 'Indoor Plant Tips: Choose low-light tolerant plants. Ensure good air circulation. Avoid cold drafts. Mist leaves for humidity. Popular: Snake plant, Pothos, Peace lily.';
    }
    if (msg.includes('outdoor') || msg.includes('garden')) {
      return 'Outdoor Gardening: Plan your garden layout. Consider climate zone. Group plants by water needs. Mulch to retain moisture. Companion planting helps growth.';
    }
    if (msg.includes('vegetable') || msg.includes('veggie')) {
      return 'Vegetable Growing: Start with easy crops like tomatoes, lettuce, beans. Ensure 6-8 hours sunlight. Rich well-drained soil needed. Regular watering essential.';
    }
    if (msg.includes('herb') || msg.includes('basil') || msg.includes('mint')) {
      return 'Herb Growing: Easy to grow herbs include Basil, Mint, Coriander. Need 4-6 hours sunlight. Harvest regularly for bushier growth. Great for containers.';
    }
    if (msg.includes('flower') || msg.includes('bloom')) {
      return 'Flower Care: Deadhead spent blooms. Feed with bloom booster. Ensure adequate sunlight. Water at base not leaves. Popular: Marigold, Rose, Sunflower.';
    }
    if (msg.includes('beginner') || msg.includes('start') || msg.includes('easy')) {
      return 'Best Plants for Beginners: Snake Plant, Pothos, Spider Plant, Aloe Vera, Marigold. All are easy to grow and maintain.';
    }
    if (msg.includes('organic') || msg.includes('natural')) {
      return 'Organic Gardening: Use organic compost. Natural pest control with neem oil. No chemical fertilizers. Companion planting. Healthy soil equals healthy plants.';
    }
    if (msg.includes('season') || msg.includes('winter') || msg.includes('summer')) {
      return 'Seasonal Tips: Summer - water more and provide shade. Monsoon - ensure drainage and prevent fungal issues. Winter - reduce watering and protect from frost. Spring is best for planting.';
    }
    if (msg.includes('product') || msg.includes('buy') || msg.includes('shop')) {
      return 'Our Products include Seeds, Plants, Gardening tools, Organic fertilizers, Pots and planters. Visit our Products page to browse!';
    }
    if (msg.includes('delivery') || msg.includes('shipping')) {
      return 'Delivery Information: Free delivery on orders above Rs.500. 3-5 business days delivery. Careful packaging for plants. Cash on delivery available.';
    }
    if (msg.includes('price') || msg.includes('cost') || msg.includes('discount')) {
      return 'Pricing and Offers: Competitive prices with regular discounts. Bulk order discounts available. Seasonal sale offers. Check product pages for current prices.';
    }
    if (msg.includes('contact') || msg.includes('support') || msg.includes('help')) {
      return 'Contact Us: Visit our Contact page. Email support available with quick response time. Expert gardening advice. We are happy to help!';
    }
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return 'Hello! Welcome to Urban Plants! I am here to help with all your plant and seed questions. What would you like to know?';
    }
    if (msg.includes('thank')) {
      return 'You are welcome! Happy gardening! Feel free to ask if you need more help.';
    }
    return 'I am not sure about that one. For this query, please contact our support team by visiting our Contact Us page and we will get back to you shortly. Or ask me about plants, seeds, watering, fertilizers, or delivery!';
  }

}
