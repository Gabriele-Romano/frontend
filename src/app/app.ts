import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');

  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly playlists = signal<any[]>([]);

  protected async load() {
    this.error.set('');
    this.loading.set(true);
    try {
      const res = await fetch('http://localhost:8081/api/search?q=instrumental');
      if (!res.ok) {
        const txt = await res.text();
        this.error.set(`Errore API ${res.status}: ${txt}`);
        this.playlists.set([]);
        return;
      }
      const data = await res.json();
      this.playlists.set(data.playlists?.items || []);
    } catch (e: any) {
      this.error.set(String(e?.message ?? e));
      this.playlists.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
