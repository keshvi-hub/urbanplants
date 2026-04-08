import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

  showGoTop = false;

  @HostListener('window:scroll')
  onScroll() { this.showGoTop = window.scrollY > 300; }
  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goBack() { window.history.back(); }

  stats = [
    { number: '10,000+', label: 'Happy Customers', icon: 'fa-smile' },
    { number: '500+',    label: 'Plant Varieties',  icon: 'fa-seedling' },
    { number: '15+',     label: 'Years Experience', icon: 'fa-award' },
    { number: '98%',     label: 'Success Rate',     icon: 'fa-chart-line' }
  ];

  values = [
    { icon: 'fa-leaf',      title: 'Sustainability', description: 'We prioritize eco-friendly practices and organic growing methods in everything we do.' },
    { icon: 'fa-heart',     title: 'Quality',        description: 'Every seed and plant is carefully selected and tested for superior quality.' },
    { icon: 'fa-users',     title: 'Community',      description: 'Building a thriving community of passionate gardeners and plant lovers.' },
    { icon: 'fa-seedling',  title: 'Growth',         description: 'Helping you grow not just plants, but knowledge, confidence and joy.' }
  ];

  expertise = [
    {
      icon: 'fa-seedling',
      title: 'Seed Cultivation',
      description: 'Expert knowledge in selecting, testing and cultivating premium quality seeds for every climate and soil type.',
      tags: ['Organic', 'Hybrid', 'Heirloom']
    },
    {
      icon: 'fa-flask',
      title: 'Soil Science',
      description: 'Deep understanding of soil composition, pH balance and nutrient management for optimal plant growth.',
      tags: ['Composting', 'pH Testing', 'Nutrients']
    },
    {
      icon: 'fa-sun',
      title: 'Climate Gardening',
      description: 'Guidance on growing plants suited to your local climate, season and available sunlight conditions.',
      tags: ['Seasonal', 'Indoor', 'Outdoor']
    },
    {
      icon: 'fa-shield-alt',
      title: 'Plant Health',
      description: 'Identifying and treating common plant diseases, pests and deficiencies using natural methods.',
      tags: ['Pest Control', 'Disease', 'Natural']
    }
  ];

  steps = [
    { icon: 'fa-search',       title: 'Browse & Select',  desc: 'Explore our wide range of plants and seeds filtered by type, season or difficulty.' },
    { icon: 'fa-shopping-cart', title: 'Add to Cart',      desc: 'Choose your favourites, select quantities and add them to your cart with ease.' },
    { icon: 'fa-box',          title: 'We Pack Carefully', desc: 'Every order is packed with care to ensure seeds and plants arrive in perfect condition.' },
    { icon: 'fa-truck',        title: 'Fast Delivery',     desc: 'Delivered right to your doorstep with free shipping on all orders.' }
  ];
}
