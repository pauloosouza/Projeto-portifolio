import { Component, AfterViewInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contato.html',
  styleUrls: ['./contato.css']
})
export class ContatoComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    const checkbox = document.getElementById("themeToggle") as HTMLInputElement;

    // 👉 Carrega tema salvo
    if (saved === "light") {
      root.classList.add("light");
      if (checkbox) checkbox.checked = true;
    } else {
      root.classList.remove("light");
      if (checkbox) checkbox.checked = false;
    }
  }

  // 🔘 Alterna o tema ao clicar no switch
  toggleTheme() {
    const root = document.documentElement;
    const checkbox = document.getElementById("themeToggle") as HTMLInputElement;

    if (!checkbox) return;

    const isLight = checkbox.checked;

    root.classList.toggle("light", isLight);

    localStorage.setItem("theme", isLight ? "light" : "dark");
  }

  // 🔥 Alterna o tema ao clicar no painel inteiro
  toggleThemeFromPanel(event: MouseEvent) {
    const checkbox = document.getElementById("themeToggle") as HTMLInputElement;

    // Se o clique veio do próprio switch, não vamos duplicar a ação
    if ((event.target as HTMLElement).closest(".switch")) return;

    // Inverte o estado do checkbox
    checkbox.checked = !checkbox.checked;

    // Chama o método principal
    this.toggleTheme();
  }

  enviarMensagem(form: NgForm) {
    const toast = document.getElementById("toast");

    if (toast) {
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }

    form.reset();
  }
}
