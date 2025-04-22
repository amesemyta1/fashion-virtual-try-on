import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header">
      <div class="container header-container">
        <div class="logo">
          <span class="logo-text">VirtualFit</span>
        </div>
        <nav class="navigation">
          <ul class="nav-list">
            <li class="nav-item active"><a href="#">Try On</a></li>
            <li class="nav-item"><a href="#">Gallery</a></li>
            <li class="nav-item"><a href="#">About</a></li>
            <li class="nav-item"><a href="#">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: rgba(17, 24, 39, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--spacing-4);
      padding-bottom: var(--spacing-4);
    }
    
    .logo {
      display: flex;
      align-items: center;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .navigation {
      display: flex;
    }
    
    .nav-list {
      display: flex;
      list-style: none;
      gap: var(--spacing-6);
    }
    
    .nav-item a {
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition-standard);
      padding: var(--spacing-2) 0;
      position: relative;
    }
    
    .nav-item a:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 0;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      transition: var(--transition-standard);
    }
    
    .nav-item a:hover, .nav-item.active a {
      color: var(--color-text-primary);
    }
    
    .nav-item a:hover:after, .nav-item.active a:after {
      width: 100%;
    }
    
    @media (max-width: 767px) {
      .header-container {
        flex-direction: column;
        gap: var(--spacing-4);
      }
      
      .nav-list {
        gap: var(--spacing-4);
      }
    }
  `]
})
export class HeaderComponent {}