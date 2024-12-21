import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [],
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.scss'
})
export class ShareModalComponent {
  @Input() shortUrl: string;
  @Output() shareClosed = new EventEmitter<void>();

  public isCopied: boolean = false;

  constructor() {
    this.shortUrl = '';
  }

  public closeModal() {
    this.shareClosed.emit();
  }

  public copyToClipboard() {
    navigator.clipboard.writeText(this.shortUrl).then(
      () => {
        this.isCopied = true;
        setTimeout(() => {
          this.isCopied = false;
        }, 1000);
      }
    )
  }

  public getWhatsAppUrl() {
    const waUrl = 'https://wa.me/?text=';
    const msg = 'Check out this link shortened with Shortify.NET:\n';
    const fullMessage = `${msg}${this.shortUrl}`;
    return waUrl + encodeURIComponent(fullMessage);
  }

  public getFBUrl() {
    const fbUrl = 'https://facebook.com/sharer.php?u=';
    return fbUrl + encodeURIComponent(this.shortUrl);
  }

  public getXUrl() {
    const xUrl = 'https://twitter.com/intent/tweet?text=';
    const msg = 'Check out this link shortened with Shortify.NET:\n';
    const fullMessage = `${msg}${this.shortUrl}`;
    return xUrl + encodeURIComponent(fullMessage);
  }

  public getThreadsUrl() {
    const threadsUrl = 'https://www.threads.net/intent/post?text=';
    const msg = 'Check out this link shortened with Shortify.NET:\n';
    const fullMessage = `${msg}${this.shortUrl}`;
    return threadsUrl + encodeURIComponent(fullMessage);
  }

  public getMailUrl() {
    const mailTo = 'mailto:?subject=';
    const sub = 'Check out my Shortify.NET Link!';
    const body = 'Check out this link shortened with Shortify.NET:\n';
    const fullMail = `${mailTo}${encodeURIComponent(sub)}&body=${encodeURIComponent(`${body}${this.shortUrl}`)}`;   
    return fullMail;    
  }

  public getLinkedInUrl() {
    const linkedInUrl = 'https://www.linkedin.com/feed/?shareActive=true&text=';
    const msg = 'Check out this link shortened with Shortify.NET:\n';
    const fullMessage = `${msg}${this.shortUrl}`;
    return linkedInUrl + encodeURIComponent(fullMessage);
  }

  public getTelegramUrl() {
    const telegramUrl = 'https://t.me/share/url?url=';
    const msg = 'Check out this link shortened with Shortify.NET:\n';
    const completeUrl = `${telegramUrl}${encodeURIComponent(this.shortUrl)}&text=${encodeURIComponent(`${msg}${this.shortUrl}`)}`;
    return completeUrl;
  }
}
