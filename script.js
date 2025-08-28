
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const isDarkMode = body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Notification system
    function showNotification(message, type = 'success') {
      const notification = document.getElementById('notification');
      const notificationText = document.getElementById('notificationText');
      const icon = notification.querySelector('i');
      
      notificationText.textContent = message;
      notification.className = 'notification ' + type;
      
      if (type === 'success') {
        icon.className = 'fas fa-check-circle';
      } else {
        icon.className = 'fas fa-exclamation-circle';
      }
      
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }

    // Progress bar animation
    function updateProgress(percent) {
      const progressFill = document.getElementById('progressFill');
      const progressPercent = document.getElementById('progressPercent');
      progressFill.style.width = percent + '%';
      progressPercent.textContent = percent + '%';
    }

    // Stats counters
    function updateStats(total, dots, plus) {
      document.getElementById('totalCount').textContent = total;
      document.getElementById('dotCount').textContent = dots;
      document.getElementById('plusCount').textContent = plus;
    }

    // Main generation function
    function insertDots(str) {
      let result = new Set();
      const len = str.length;
      const max = Math.pow(2, len - 1);
      
      for (let i = 0; i < max; i++) {
        let s = str[0];
        for (let j = 0; j < len - 1; j++) {
          s += (i & (1 << j)) ? "." + str[j + 1] : str[j + 1];
        }
        result.add(s);
      }
      return Array.from(result);
    }

    function generate() {
      const base = document.getElementById("base").value.trim();
      if (!base) {
        showNotification('Please enter a Gmail username!', 'error');
        return;
      }

      // Reset progress
      updateProgress(0);
      updateStats(0, 0, 0);

      // Simulate progress for better UX
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress >= 90) {
          clearInterval(progressInterval);
        }
        updateProgress(progress);
      }, 50);

      // Actual generation (setTimeout to allow UI to update)
      setTimeout(() => {
        const tags = ['test', 'mail', 'bot', 'site', 'acc', 'demo', 'dev', 'user', '123', 'work', 'personal', 'backup', 'temp', 'noreply', 'contact', 'info', 'support', 'admin', 'service'];
        const dots = insertDots(base);
        let result = new Set();
        let dotCount = 0;
        let plusCount = 0;

        // Add dot variants
        dots.forEach(d => {
          result.add(`${d}@gmail.com`);
          dotCount++;
          
          // Add plus variants for each dot variant
          tags.forEach(t => {
            result.add(`${d}+${t}@gmail.com`);
            plusCount++;
          });
        });

        // Add random plus variants if we need more
        while (result.size < 1024) {
          const randomTag = Math.random().toString(36).substring(2, 10);
          result.add(`${base}+${randomTag}@gmail.com`);
          plusCount++;
        }

        const output = Array.from(result).slice(0, 1024).join("\n");
        document.getElementById("output").value = output;
        
        // Final progress update
        updateProgress(100);
        updateStats(result.size, dotCount, plusCount);
        
        showNotification(`✅ Generated ${result.size} email variants!`);
        
        clearInterval(progressInterval);
      }, 100);
    }

    function copyToClipboard() {
      const output = document.getElementById("output");
      if (!output.value.trim()) {
        showNotification('Nothing to copy!', 'error');
        return;
      }
      
      output.select();
      document.execCommand("copy");
      showNotification("📋 Copied to clipboard!");
    }

    function downloadEmails() {
      const output = document.getElementById("output").value;
      if (!output.trim()) {
        showNotification('Nothing to download!', 'error');
        return;
      }
      
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gmail-variants.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification("📥 Downloaded email list!");
    }

    function clearAll() {
      document.getElementById("base").value = '';
      document.getElementById("output").value = '';
      updateStats(0, 0, 0);
      updateProgress(0);
      showNotification("🧹 Cleared all data!");
    }

    // Initialize with sample data for demo
    window.addEventListener('load', () => {
      document.getElementById("base").value = "";
    });