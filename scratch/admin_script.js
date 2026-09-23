
    // Custom Premium Alert Dialog overriding native window.alert
    window.alert = function(message) {
      let alertBox = document.getElementById("custom-alert-popup");
      if (!alertBox) {
        alertBox = document.createElement("div");
        alertBox.id = "custom-alert-popup";
        alertBox.style.position = "fixed";
        alertBox.style.top = "24px";
        alertBox.style.left = "50%";
        alertBox.style.transform = "translateX(-50%) translateY(-20px)";
        alertBox.style.zIndex = "99999";
        alertBox.style.backgroundColor = "rgba(15, 23, 42, 0.95)";
        alertBox.style.color = "#f8fafc";
        alertBox.style.padding = "1rem 1.75rem";
        alertBox.style.borderRadius = "12px";
        alertBox.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)";
        alertBox.style.border = "1px solid rgba(255, 255, 255, 0.1)";
        alertBox.style.fontFamily = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
        alertBox.style.fontSize = "0.9rem";
        alertBox.style.fontWeight = "600";
        alertBox.style.display = "flex";
        alertBox.style.alignItems = "center";
        alertBox.style.gap = "0.75rem";
        alertBox.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
        alertBox.style.opacity = "0";
        
        document.body.appendChild(alertBox);
      }
      
      if (window.customAlertTimeout) {
        clearTimeout(window.customAlertTimeout);
      }
      
      const isError = /hata|error|silme/i.test(message);
      const iconColor = isError ? "var(--danger)" : "var(--primary)";
      const iconSvg = isError 
        ? `<svg style="width: 20px; height: 20px; color: ${iconColor};" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
        : `<svg style="width: 20px; height: 20px; color: ${iconColor};" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

      alertBox.innerHTML = `
        <span style="display: flex; align-items: center;">${iconSvg}</span>
        <span>${message}</span>
      `;
      
      requestAnimationFrame(() => {
        alertBox.style.opacity = "1";
        alertBox.style.transform = "translateX(-50%) translateY(0)";
      });
      
      window.customAlertTimeout = setTimeout(() => {
        alertBox.style.opacity = "0";
        alertBox.style.transform = "translateX(-50%) translateY(-20px)";
      }, 3500);
    };

    // Intercept fetch calls to append local_session query parameter for localhost/cookie compatibility
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      if (typeof input === 'string' && input.includes('api/cms.php')) {
        const isLocalLogged = sessionStorage.getItem('admin_logged_in') === 'true';
        if (isLocalLogged) {
          const separator = input.includes('?') ? '&' : '?';
          input = input + separator + 'local_session=1';
        }
      }
      return originalFetch(input, init);
    };

    // Inactivity and Auto-Logout Handler Disabled (User Session Persists Indefinitely)
    function resetInactivityTimer() {}
    function clearInactivityTimers() {}
    function showInactivityWarning() {}
    async function logoutDueToInactivity() {}

    // Local Memory Array for Demo Mode
    let productsList = [...fallbackProducts];
    let categoriesList = [...fallbackCategories];
    let machinesList = [];
    let contactsList = [];
    let selectedImageFile = null;

    // Unified PHP CMS Session Check
    async function checkSession() {
      try {
        const response = await fetch('api/cms.php?action=check_session');
        if (!response.ok) throw new Error("HTTP error " + response.status);
        const data = await response.json();
        
        if (data.logged_in) {
          sessionStorage.setItem('admin_logged_in', 'true');
          document.getElementById("login-section").style.display = "none";
          document.getElementById("dashboard-section").style.display = "block";
          document.getElementById("user-display").textContent = data.username || "Yönetici";
          loadCMSData();
          resetInactivityTimer();
        } else {
          sessionStorage.removeItem('admin_logged_in');
          document.getElementById("login-section").style.display = "flex";
          document.getElementById("dashboard-section").style.display = "none";
          clearInactivityTimers();
        }
      } catch (err) {
        console.error("Session check failed:", err);
        sessionStorage.removeItem('admin_logged_in');
        document.getElementById("login-section").style.display = "flex";
        document.getElementById("dashboard-section").style.display = "none";
        clearInactivityTimers();
      }
    }

    document.addEventListener("DOMContentLoaded", () => {
      // Hide warning banner since Firebase is no longer used
      const warnBanner = document.getElementById("firebase-warning");
      if (warnBanner) warnBanner.style.display = "none";
      
      checkSession();

      // Inactivity Modal Button Event Listeners Disabled
    });

    // Login Form Submit
    document.getElementById("login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const user = document.getElementById("login-email").value;
      const pass = document.getElementById("login-password").value;
      const errorDiv = document.getElementById("login-error");

      try {
        const response = await fetch('api/cms.php?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, password: pass })
        });
        
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          errorDiv.style.display = "none";
          sessionStorage.setItem('admin_logged_in', 'true');
          
          // Direct login for instant feedback
          document.getElementById("login-section").style.display = "none";
          document.getElementById("dashboard-section").style.display = "block";
          document.getElementById("user-display").textContent = user || "Yönetici";
          loadCMSData();
          resetInactivityTimer();
        } else {
          throw new Error(data.message || "Giriş başarısız.");
        }
      } catch (err) {
        errorDiv.textContent = "Giriş başarısız: " + err.message;
        errorDiv.style.display = "block";
        sessionStorage.removeItem('admin_logged_in');
        clearInactivityTimers();
      }
    });

    // Register User Action (Bypassed)
    document.getElementById("register-btn").addEventListener("click", () => {
      alert("Bu CMS sisteminde kullanıcı yönetimi yerel dosya tabanlıdır. Varsayılan kullanıcı adı 'admin', şifre 'admin123' şeklindedir.");
    });

    // Logout Action
    document.getElementById("logout-btn").addEventListener("click", async () => {
      try {
        await fetch('api/cms.php?action=logout', { method: 'POST' });
      } catch (err) {
        console.error("Logout fetch failed:", err);
      }
      sessionStorage.removeItem('admin_logged_in');
      clearInactivityTimers();
      checkSession();
    });

    // Toggle Mobile Sidebar
    window.toggleMobileSidebar = function() {
      const sidebar = document.querySelector('.admin-sidebar');
      const backdrop = document.querySelector('.mobile-backdrop');
      sidebar.classList.toggle('show');
      backdrop.classList.toggle('show');
    };

    // Switch Dashboard Tabs
    window.switchTab = function(tabId, btnEl) {
      document.querySelectorAll(".sidebar-btn").forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
      
      if (btnEl) {
        btnEl.classList.add("active");
      } else {
        const btns = document.querySelectorAll(".sidebar-btn");
        btns.forEach(b => {
          if (b.getAttribute("onclick") && b.getAttribute("onclick").includes(tabId)) {
            b.classList.add("active");
          }
        });
      }
      
      document.getElementById(tabId).classList.add("active");
    };

    // Load Data from PHP CMS Backend
    async function loadCMSData() {
      try {
        const response = await fetch('api/cms.php?action=load');
        if (!response.ok) throw new Error("HTTP error " + response.status);
        const data = await response.json();
        
        if (data.status === 'success') {
          categoriesList = data.categories || [];
          productsList = data.products || [];
          machinesList = data.machines || [];
          contactsList = data.contacts || [];
          
          if (data.translations) {
            translationsData = data.translations;
            // Merge with local fallback keys to ensure new keys are present
            if (translationsData.tr) translationsData.tr = { ...fallbackTranslations.tr, ...translationsData.tr };
            if (translationsData.en) translationsData.en = { ...fallbackTranslations.en, ...translationsData.en };
          } else {
            translationsData = fallbackTranslations;
          }
        } else {
          throw new Error(data.message || "CMS data load failed");
        }
      } catch (err) {
        console.error("Error loading CMS data:", err);
        categoriesList = [...fallbackCategories];
        productsList = [...fallbackProducts];
        machinesList = [];
        contactsList = [];
        translationsData = fallbackTranslations;
      }
      renderCategoriesTable();
      renderProductsTable();
      renderMachinesTable();
      renderContactsTable();
      updateProductCategoryDropdown();
      loadTranslations();
    }

    // Render Products Table
    function renderProductsTable() {
      const tbody = document.querySelector("#products-table tbody");
      tbody.innerHTML = "";
      
      productsList.forEach(prod => {
        const tr = document.createElement("tr");
        const categoryName = getCategoryName(prod.category_id);
        
        const statusBadge = prod.status === 'passive' 
          ? '<span class="badge status-badge-animate" style="background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; font-size: 0.72rem; margin-left: 0.5rem; padding: 2px 6px;">Pasif</span>' 
          : '<span class="badge status-badge-animate" style="background: #dcfce7; color: #22c55e; border: 1px solid #86efac; font-size: 0.72rem; margin-left: 0.5rem; padding: 2px 6px;">Aktif</span>';

        tr.innerHTML = `
          <td><img src="${prod.image || 'assets/product-pp.png'}" class="thumb-preview" style="${prod.filter || ''}; width: 50px; height: 50px; object-fit: contain; padding: 4px; background: white; border-radius: 6px; border: 1px solid var(--border-color);"></td>
          <td>
            <strong>${prod.code || ''}</strong>${statusBadge}<br>
            <span style="font-size: 0.82rem; color: var(--gray); display: block; margin-top: 0.15rem;">TR: ${prod.name_tr}</span>
            <span style="font-size: 0.82rem; color: #94a3b8; display: block;">EN: ${prod.name_en || ''}</span>
          </td>
          <td><span class="badge badge-${prod.category_id}">${categoryName}</span></td>
          <td><code>${prod.mfi}</code></td>
          <td><code>${prod.density}</code></td>
          <td>
            <a href="urun-detay?id=${prod.id}" target="_blank" class="btn btn-outline" style="padding: 0.35rem 0.7rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.25rem;">
              <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Sitede Gör
            </a>
          </td>
          <td style="text-align: center;">
            <label class="status-switch-container" title="Sitede Göster / Gizle">
              <div class="status-switch">
                <input type="checkbox" ${prod.status !== 'passive' ? 'checked' : ''} onchange="toggleProductStatus('${prod.id}', this.checked)">
                <span class="status-slider"></span>
              </div>
            </label>
          </td>
          <td>
            <div style="display: flex; gap: 0.5rem; justify-content: center;">
              <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="editProduct('${prod.id}')">Düzenle</button>
              <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="deleteProduct('${prod.id}')">Sil</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Render Categories Table
    function renderCategoriesTable() {
      const tbody = document.querySelector("#categories-table tbody");
      tbody.innerHTML = "";
      
      categoriesList.forEach(cat => {
        const tr = document.createElement("tr");
        const productCount = productsList.filter(p => p.category_id === cat.id).length;
        const frontendUrl = cat.url || (cat.id === 'pp' ? 'urun-pp-moblen.html' : cat.id === 'pe' ? 'urun-elteks.html' : cat.id === 'pprc' ? 'urun-pprc.html' : cat.id === 'other' ? 'urun-diger.html' : `urun-kategori.html?id=${cat.id}`);
        
        tr.innerHTML = `
          <td><code>${cat.id}</code></td>
          <td>
            <strong>${cat.title_tr}</strong><br>
            <span style="font-size: 0.8rem; color: var(--gray);">${cat.title_en}</span>
          </td>
          <td><span class="badge" style="background: #f1f5f9; color: #475569; border: 1px solid var(--border-color); font-weight: 700;">${productCount} Hammadde</span></td>
          <td style="font-size: 0.85rem; color: var(--gray); max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${cat.desc_tr}</td>
          <td>
            <a href="${frontendUrl}" target="_blank" class="btn btn-outline" style="padding: 0.35rem 0.7rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.25rem;">
              <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Sitede Gör
            </a>
          </td>
          <td>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="editCategory('${cat.id}')">Düzenle</button>
              ${["pp", "pe", "pprc", "other"].includes(cat.id) 
                ? `<button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; opacity: 0.4; cursor: not-allowed;" onclick="alert('Sistemin varsayılan 4 ana kategorisi silinemez.')" title="Varsayılan kategori silinemez">Sil</button>`
                : `<button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="deleteCategory('${cat.id}')">Sil</button>`
              }
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function updateProductCategoryDropdown() {
      const select = document.getElementById("prod-category");
      if (!select) return;
      select.innerHTML = "";
      categoriesList.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.title_tr;
        select.appendChild(option);
      });
    }

    function getCategoryName(catId) {
      const cat = categoriesList.find(c => c.id === catId);
      return cat ? cat.title_tr : catId;
    }

    function openProductModal() {
      document.getElementById("product-form").reset();
      document.getElementById("edit-product-id").value = "";
      document.getElementById("prod-status").value = "active";
      document.getElementById("product-modal-title").textContent = "Yeni Ürün Ekle";
      document.getElementById("modal-img-preview").src = "assets/product-pp.png";
      document.getElementById("modal-img-preview").style.filter = "none";
      selectedImageFile = null;
      document.getElementById("product-modal").classList.add("show");
    }

    function closeProductModal() {
      document.getElementById("product-modal").classList.remove("show");
    }

    function previewSelectedImage(event) {
      const file = event.target.files[0];
      if (file) {
        selectedImageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.getElementById("modal-img-preview");
          img.src = e.target.result;
          img.style.filter = "none";
        };
        reader.readAsDataURL(file);
      }
    }

    // Edit Product
    window.editProduct = function(id) {
      const prod = productsList.find(p => p.id === id);
      if (!prod) return;

      document.getElementById("edit-product-id").value = prod.id;
      document.getElementById("prod-code").value = prod.code || "";
      document.getElementById("prod-category").value = prod.category_id;
      document.getElementById("prod-name-tr").value = prod.name_tr;
      document.getElementById("prod-name-en").value = prod.name_en;
      document.getElementById("prod-desc-tr").value = prod.desc_tr;
      document.getElementById("prod-desc-en").value = prod.desc_en;
      document.getElementById("prod-detail-tr").value = prod.detail_tr || "";
      document.getElementById("prod-detail-en").value = prod.detail_en || "";
      document.getElementById("prod-mfi").value = prod.mfi;
      document.getElementById("prod-density").value = prod.density;
      document.getElementById("prod-color-tr").value = prod.color_tr;
      document.getElementById("prod-color-en").value = prod.color_en;
      document.getElementById("prod-status").value = prod.status || "active";
      
      // Convert arrays back to comma separated list if applicable
      document.getElementById("prod-usage-tr").value = Array.isArray(prod.usage_tr) ? prod.usage_tr.join(", ") : (prod.usage_tr || "");
      document.getElementById("prod-usage-en").value = Array.isArray(prod.usage_en) ? prod.usage_en.join(", ") : (prod.usage_en || "");

      const preview = document.getElementById("modal-img-preview");
      preview.src = prod.image || "assets/product-pp.png";
      preview.style.filter = prod.filter || "none";
      selectedImageFile = null;

      document.getElementById("product-modal-title").textContent = "Ürün Düzenle";
      document.getElementById("product-modal").classList.add("show");
    }

    // Save Product
    document.getElementById("product-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const id = document.getElementById("edit-product-id").value || "prod_" + Date.now();
      const code = document.getElementById("prod-code").value.trim() || "-";
      const categoryId = document.getElementById("prod-category").value;
      const nameTr = document.getElementById("prod-name-tr").value.trim() || "-";
      const nameEn = document.getElementById("prod-name-en").value.trim() || "-";
      const descTr = document.getElementById("prod-desc-tr").value.trim() || "-";
      const descEn = document.getElementById("prod-desc-en").value.trim() || "-";
      const detailTr = document.getElementById("prod-detail-tr").value.trim() || "-";
      const detailEn = document.getElementById("prod-detail-en").value.trim() || "-";
      const mfi = document.getElementById("prod-mfi").value.trim() || "-";
      const density = document.getElementById("prod-density").value.trim() || "-";
      const colorTr = document.getElementById("prod-color-tr").value.trim() || "-";
      const colorEn = document.getElementById("prod-color-en").value.trim() || "-";
      const status = document.getElementById("prod-status").value;
      
      // Split comma separated inputs
      const usageTrVal = document.getElementById("prod-usage-tr").value.trim();
      const usageTr = usageTrVal ? usageTrVal.split(",").map(s => s.trim()).filter(s => s) : ["-"];
      const usageEnVal = document.getElementById("prod-usage-en").value.trim();
      const usageEn = usageEnVal ? usageEnVal.split(",").map(s => s.trim()).filter(s => s) : ["-"];

      let imageSrc = document.getElementById("modal-img-preview").src;
      let filterVal = document.getElementById("modal-img-preview").style.filter || "none";
      
      // Default fallback images for categories
      if (imageSrc.includes("assets/product-pp.png") && categoryId === "pe") {
        imageSrc = "assets/product-pe.png";
      } else if (imageSrc.includes("assets/product-pp.png") && (categoryId === "pprc" || categoryId === "other")) {
        imageSrc = "assets/product-compound.png";
      }

      const productData = {
        code,
        category_id: categoryId,
        name_tr: nameTr,
        name_en: nameEn,
        desc_tr: descTr,
        desc_en: descEn,
        detail_tr: detailTr,
        detail_en: detailEn,
        mfi,
        density,
        color_tr: colorTr,
        color_en: colorEn,
        usage_tr: usageTr,
        usage_en: usageEn,
        image: imageSrc,
        filter: filterVal,
        status: status
      };

      try {
        if (selectedImageFile) {
          // Open progress modal
          const progressModal = document.getElementById("progress-modal");
          const progressBar = document.getElementById("progress-bar");
          const progressPercent = document.getElementById("progress-percent");
          const progressFilename = document.getElementById("progress-filename");
          if (progressModal) {
            progressFilename.textContent = selectedImageFile.name;
            progressBar.style.width = "0%";
            progressPercent.textContent = "0%";
            progressModal.style.display = "flex";
          }
          
          const fileUrl = await uploadFileToServer(selectedImageFile, (percent) => {
            if (progressBar) progressBar.style.width = percent + "%";
            if (progressPercent) progressPercent.textContent = Math.round(percent) + "%";
          });
          if (progressModal) progressModal.style.display = "none";
          
          productData.image = fileUrl;
          productData.filter = "none"; // Uploaded custom images don't need hue rotate
        }
        const response = await fetch(`api/cms.php?action=save_product&id=${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const resData = await response.json();
        if (response.ok && resData.status === 'success') {
          alert("Ürün başarıyla kaydedildi.");
          loadCMSData();
        } else {
          throw new Error(resData.message || "Kaydetme hatası.");
        }
      } catch (error) {
        window.showDebugError("Ürün Ekleme / Güncelleme", error);
        alert("Kaydetme hatası! Detaylar için sağ alttaki Hata Ayıklayıcı panelini kontrol edin.");
      }

      closeProductModal();
    });

    // Delete Product
    window.deleteProduct = function(id) {
      if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

      fetch(`api/cms.php?action=delete_product&id=${id}`, { method: 'POST' })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
          if (ok && data.status === 'success') {
            alert("Ürün silindi.");
            loadCMSData();
          } else {
            throw new Error(data.message || "Silme hatası.");
          }
        })
        .catch(err => {
          alert("Silme hatası: " + err.message);
        });
    }

    // Toggle Product Status (Active/Passive Switch)
    window.toggleProductStatus = async function(id, isChecked) {
      const prod = productsList.find(p => p.id === id);
      if (!prod) return;
      
      const newStatus = isChecked ? 'active' : 'passive';
      prod.status = newStatus; // Update local state in memory
      
      // Update badge dynamically inside DOM row
      const editBtn = document.querySelector(`button[onclick="editProduct('${id}')"]`);
      if (editBtn) {
        const row = editBtn.closest('tr');
        if (row) {
          const badgeSpan = row.querySelector('.status-badge-animate');
          if (badgeSpan) {
            badgeSpan.style.animation = 'none';
            // Force reflow to restart animation
            badgeSpan.offsetHeight;
            badgeSpan.style.animation = '';
            
            if (newStatus === 'passive') {
              badgeSpan.style.cssText = 'background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; font-size: 0.72rem; margin-left: 0.5rem; padding: 2px 6px;';
              badgeSpan.textContent = 'Pasif';
            } else {
              badgeSpan.style.cssText = 'background: #dcfce7; color: #22c55e; border: 1px solid #86efac; font-size: 0.72rem; margin-left: 0.5rem; padding: 2px 6px;';
              badgeSpan.textContent = 'Aktif';
            }
          }
        }
      }
      
      try {
        const response = await fetch(`api/cms.php?action=save_product&id=${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prod)
        });
        const resData = await response.json();
        if (!response.ok || resData.status !== 'success') {
          throw new Error(resData.message || "Durum güncellenemedi.");
        }
      } catch (error) {
        window.showDebugError("Ürün Durum Güncelleme", error);
        alert("Durum güncellenirken hata oluştu!");
        prod.status = isChecked ? 'passive' : 'active';
        loadCMSData(); // Revert completely
      }
    };

    // Toggle Machine Status (Active/Passive Switch)
    window.toggleMachineStatus = async function(id, isChecked) {
      const mach = machinesList.find(m => m.id === id);
      if (!mach) return;
      
      const newStatus = isChecked ? 'active' : 'passive';
      mach.status = newStatus; // Update local state in memory
      
      // Update badge dynamically inside DOM row
      const editBtn = document.querySelector(`button[onclick="editMachine('${id}')"]`);
      if (editBtn) {
        const row = editBtn.closest('tr');
        if (row) {
          const badgeSpan = row.querySelector('.status-badge-animate');
          if (badgeSpan) {
            badgeSpan.style.animation = 'none';
            // Force reflow to restart animation
            badgeSpan.offsetHeight;
            badgeSpan.style.animation = '';
            
            if (newStatus === 'passive') {
              badgeSpan.style.cssText = 'background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; font-size: 0.72rem; margin-left: 0.5rem; padding: 2px 6px;';
              badgeSpan.textContent = 'Pasif';
            } else {
              badgeSpan.style.cssText = 'background: #dcfce7; color: #22c55e; border: 1px solid #86efac; font-size: 0.72rem; margin-left: 0.5rem; padding: 2px 6px;';
              badgeSpan.textContent = 'Aktif';
            }
          }
        }
      }
      
      try {
        const response = await fetch(`api/cms.php?action=save_machine&id=${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mach)
        });
        const resData = await response.json();
        if (!response.ok || resData.status !== 'success') {
          throw new Error(resData.message || "Durum güncellenemedi.");
        }
      } catch (error) {
        window.showDebugError("Makine Durum Güncelleme", error);
        alert("Durum güncellenirken hata oluştu!");
        mach.status = isChecked ? 'passive' : 'active';
        loadCMSData(); // Revert completely
      }
    };

    // Modal Operations: Category
    window.openCategoryModal = function(isEdit) {
      document.getElementById("category-form").reset();
      const idGroup = document.getElementById("cat-id-group");
      const title = document.getElementById("category-modal-title");
      
      if (isEdit) {
        idGroup.style.display = "none";
        document.getElementById("cat-id").required = false;
        title.textContent = "Kategori Düzenle";
      } else {
        idGroup.style.display = "block";
        document.getElementById("cat-id").required = true;
        document.getElementById("edit-cat-id").value = "";
        title.textContent = "Yeni Kategori Ekle";
      }
      document.getElementById("category-modal").classList.add("show");
    }

    window.editCategory = function(id) {
      const cat = categoriesList.find(c => c.id === id);
      if (!cat) return;

      openCategoryModal(true);
      document.getElementById("edit-cat-id").value = cat.id;
      document.getElementById("cat-title-tr").value = cat.title_tr;
      document.getElementById("cat-title-en").value = cat.title_en;
      document.getElementById("cat-desc-tr").value = cat.desc_tr;
      document.getElementById("cat-desc-en").value = cat.desc_en;
    }

    window.closeCategoryModal = function() {
      document.getElementById("category-modal").classList.remove("show");
    }

    // Delete Category
    window.deleteCategory = function(id) {
      if (["pp", "pe", "pprc", "other"].includes(id)) {
        alert("Sistemin varsayılan 4 ana kategorisi (PP, PE, PPRC, Özel) silinemez.");
        return;
      }
      if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? Bu kategoriye ait ürünler silinmeyecektir ancak sahipsiz kalabilir.")) return;

      fetch(`api/cms.php?action=delete_category&id=${id}`, { method: 'POST' })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
          if (ok && data.status === 'success') {
            alert("Kategori silindi.");
            loadCMSData();
          } else {
            throw new Error(data.message || "Silme hatası.");
          }
        })
        .catch(err => {
          alert("Silme hatası: " + err.message);
        });
    }

    // Save Category
    document.getElementById("category-form").addEventListener("submit", (e) => {
      e.preventDefault();
      
      const isEdit = !!document.getElementById("edit-cat-id").value;
      const id = isEdit 
        ? document.getElementById("edit-cat-id").value 
        : document.getElementById("cat-id").value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
      
      if (!id) {
        alert("Lütfen geçerli bir kategori kodu girin.");
        return;
      }

      const titleTr = document.getElementById("cat-title-tr").value.trim() || "-";
      const titleEn = document.getElementById("cat-title-en").value.trim() || "-";
      const descTr = document.getElementById("cat-desc-tr").value.trim() || "-";
      const descEn = document.getElementById("cat-desc-en").value.trim() || "-";

      // New categories map to urun-kategori.html?id=[id]
      const url = isEdit 
        ? (categoriesList.find(c => c.id === id)?.url || `urun-kategori.html?id=${id}`)
        : `urun-kategori.html?id=${id}`;

      const catData = {
        title_tr: titleTr,
        title_en: titleEn,
        desc_tr: descTr,
        desc_en: descEn,
        url: url
      };

      fetch(`api/cms.php?action=save_category&id=${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catData)
        })
          .then(response => response.json().then(data => ({ ok: response.ok, data })))
          .then(({ ok, data }) => {
            if (ok && data.status === 'success') {
              alert("Kategori başarıyla kaydedildi.");
              loadCMSData();
            } else {
              throw new Error(data.message || "Kaydetme hatası.");
            }
          })
          .catch(err => {
            window.showDebugError("Kategori Ekleme / Güncelleme", err);
            alert("Kaydetme hatası! Detaylar için sağ alttaki Hata Ayıklayıcı panelini kontrol edin.");
          });
      closeCategoryModal();
    });

    // Database Seed Trigger
    document.getElementById("seed-db-btn").addEventListener("click", async () => {
      if (!confirm("UYARI: Bu işlem veritabanındaki mevcut ürünleri temizleyerek yerlerine varsayılan 4 kategori ve 11 ürünü yükleyecektir. Devam etmek istiyor musunuz?")) return;

      const messageDiv = document.getElementById("seed-message");
      messageDiv.style.color = "var(--gray)";
      messageDiv.textContent = "İlk kurulum başlatılıyor, lütfen bekleyin...";

      try {
        const tResp = await fetch('api/cms.php?action=save_translations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fallbackTranslations)
        });
        if (!tResp.ok) throw new Error("Çeviri kaydetme başarısız.");

        for (const cat of fallbackCategories) {
          const { id, ...data } = cat;
          const cResp = await fetch(`api/cms.php?action=save_category&id=${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!cResp.ok) throw new Error("Kategori kaydetme başarısız: " + id);
        }

        const loadResp = await fetch('api/cms.php?action=load');
        const loadDataObj = await loadResp.json();
        if (loadDataObj.status === 'success') {
          for (const p of loadDataObj.products || []) {
            await fetch(`api/cms.php?action=delete_product&id=${p.id}`, { method: 'POST' });
          }
          for (const c of loadDataObj.categories || []) {
            if (!["pp", "pe", "pprc", "other"].includes(c.id)) {
              await fetch(`api/cms.php?action=delete_category&id=${c.id}`, { method: 'POST' });
            }
          }
        }

        for (const prod of fallbackProducts) {
          const { id, ...data } = prod;
          const pResp = await fetch(`api/cms.php?action=save_product&id=${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!pResp.ok) throw new Error("Ürün kaydetme başarısız: " + id);
        }

        messageDiv.style.color = "var(--success)";
        messageDiv.textContent = "Başarılı! Varsayılan veriler yerel JSON veritabanına aktarıldı.";
        loadCMSData();
      } catch (error) {
        messageDiv.style.color = "var(--danger)";
        messageDiv.textContent = "Hata oluştu: " + error.message;
      }
    });
    // --- Dynamic Translations Management ---
    let translationsData = {};

    function loadTranslations() {
      if (!translationsData || !translationsData.tr) {
        translationsData = fallbackTranslations;
      }
      renderTranslationsForm();
    }

        const keyDescriptions = {
      // Nav & CTAs
      nav_home: "Navigasyon - Anasayfa Linki",
      nav_about: "Navigasyon - Hakkımızda Linki",
      nav_products: "Navigasyon - Ürünler Linki",
      nav_process: "Navigasyon - Üretim Süreci Linki",
      nav_quality: "Navigasyon - Kalite & Sertifikalar Linki",
      nav_sustain: "Navigasyon - Sürdürülebilirlik Linki",
      nav_contact: "Navigasyon - İletişim Linki",
      cta_quote: "Sağ Üst Buton - Teklif Talep Et",
      cta_quote_long: "Buton - Bize Ulaşın / Teklif İsteyin",
      back_to_catalog: "Buton - Ürün Kataloğuna Dön",

      // Products Header
      products_tag: "Ürünler Sayfası - Üst Küçük Başlık",
      products_title: "Ürünler Sayfası - Ana Başlık",
      products_subtitle: "Ürünler Sayfası - Alt Metin",

      // Hero Section
      hero_tagline: "Anasayfa Hero - Küçük Yeşil Üst Başlık",
      hero_title: "Anasayfa Hero - Büyük Kalın Başlık",
      hero_desc: "Anasayfa Hero - Alt Paragraf Metni",
      cta_explore: "Buton - Ürünleri İncele",

      // About Us (Biz Kimiz) Section
      about_tag: "Biz Kimiz - Küçük Yeşil Üst Başlık",
      about_title: "Biz Kimiz - Büyük Bölüm Başlığı",
      about_hero_sub: "Hakkımızda Sayfası - Üst Giriş Alt Metni",
      about_history_title: "Hakkımızda Sayfası - Tarihçe Başlığı",
      about_desc_1: "Kurumsal Metin - Paragraf 1 (Kuruluş)",
      about_desc_2: "Kurumsal Metin - Paragraf 2 (Tesisler)",
      about_desc_3: "Kurumsal Metin - Paragraf 3 (Vizyon)",
      val_years: "Sayaç Etiketi - Tecrübe (Yıl)",
      val_capacity: "Sayaç Etiketi - Kapasite (Ton)",
      val_trace: "Sayaç Etiketi - İzlenebilirlik",
      read_more: "Buton - Kurumsal Detaylar (Anasayfa)",

      // Values Section
      values_tag: "Değerlerimiz - Küçük Yeşil Üst Başlık",
      values_title: "Değerlerimiz - Büyük Bölüm Başlığı",
      val_title_1: "Kurumsal İlke 1 - Başlık",
      val_text_1: "Kurumsal İlke 1 - Detay Metni",
      val_title_2: "Kurumsal İlke 2 - Başlık",
      val_text_2: "Kurumsal İlke 2 - Detay Metni",
      val_title_3: "Kurumsal İlke 3 - Başlık",
      val_text_3: "Kurumsal İlke 3 - Detay Metni",

      // Process Section
      process_tag: "Geri Kazanım - Küçük Yeşil Üst Başlık",
      process_title: "Geri Kazanım - Büyük Bölüm Başlığı",
      process_subtitle: "Geri Kazanım - Üst Alt Metin",
      process_hero_sub: "Süreç Sayfası - Üst Giriş Alt Metni",
      explore_process: "Buton - Üretim Aşamalarını İncele",
      step_1_title: "Geri Kazanım Adım 1 - Başlık",
      step_1_desc: "Geri Kazanım Adım 1 - Detay Metni",
      step_2_title: "Geri Kazanım Adım 2 - Başlık",
      step_2_desc: "Geri Kazanım Adım 2 - Detay Metni",
      step_3_title: "Geri Kazanım Adım 3 - Başlık",
      step_3_desc: "Geri Kazanım Adım 3 - Detay Metni",
      step_4_title: "Geri Kazanım Adım 4 (Kırma) - Başlık",
      step_4_desc: "Geri Kazanım Adım 4 (Kırma) - Detay Metni",
      step_5_title: "Geri Kazanım Adım 5 (Ekstrüzyon) - Başlık",
      step_5_desc: "Geri Kazanım Adım 5 (Ekstrüzyon) - Detay Metni",
      step_6_title: "Geri Kazanım Adım 6 (Granül) - Başlık",
      step_6_desc: "Geri Kazanım Adım 6 (Granül) - Detay Metni",

      // Products Catalog Short Descriptions
      prod_pp_short: "Ürün Kartı Özet - Polipropilen (PP)",
      prod_pe_short: "Ürün Kartı Özet - Polietilen (PE)",
      prod_pprc_title: "Ürün Grubu Başlığı - PPR-C",
      prod_pprc_short: "Ürün Kartı Özet - PPR-C",
      prod_compound_title: "Ürün Grubu Başlığı - Özel Kompaundlar",
      prod_compound_short: "Ürün Kartı Özet - Özel Kompaundlar",
      prod_view_details: "Buton - Detayları İncele",
      pp_hero_sub: "PP Sayfası - Üst Giriş Alt Metni",
      pp_detail_title: "PP Sayfası - Detay Başlığı",
      pp_detail_desc: "PP Sayfası - Detay Tanıtım Metni",
      pe_hero_sub: "PE Sayfası - Üst Giriş Alt Metni",
      pe_detail_title: "PE Sayfası - Detay Başlığı",
      pe_detail_desc: "PE Sayfası - Detay Tanıtım Metni",
      compound_hero_sub: "Kompaund Sayfası - Üst Giriş Alt Metni",
      compound_detail_title: "Kompaund Sayfası - Detay Başlığı",
      compound_detail_desc: "Kompaund Sayfası - Detay Tanıtım Metni",
      pprc_detail_title: "PPR-C Sayfası - Detay Başlığı",
      pprc_hero_sub: "PPR-C Sayfası - Üst Giriş Alt Metni",
      pprc_green_title: "PPR-C Yeşil Ürün Kartı Başlığı",
      pprc_green_desc: "PPR-C Yeşil Ürün Kartı Açıklaması",
      pprc_gray_title: "PPR-C Gri Ürün Kartı Başlığı",
      pprc_gray_desc: "PPR-C Gri Ürün Kartı Açıklaması",
      pprc_white_title: "PPR-C Beyaz Ürün Kartı Başlığı",
      pprc_white_desc: "PPR-C Beyaz Ürün Kartı Açıklaması",
      gf30_title: "Cam Elyaf Takviyeli PP Başlığı",
      gf30_desc: "Cam Elyaf Takviyeli PP Açıklaması",

      // Quality Section
      quality_tag: "Kalite Güvencesi - Küçük Yeşil Üst Başlık",
      quality_title: "Kalite Güvencesi - Büyük Bölüm Başlığı",
      quality_hero_sub: "Kalite Sayfası - Üst Giriş Alt Metni",
      quality_lab_title: "Kalite Sayfası - Lab Başlığı",
      quality_desc_1: "Kalite Sayfası - Lab Paragraf 1",
      quality_desc_2: "Kalite Sayfası - Lab Paragraf 2",
      qual_item_1: "Kalite Parametresi 1",
      qual_item_2: "Kalite Parametresi 2",
      qual_item_3: "Kalite Parametresi 3",
      qual_item_4: "Kalite Parametresi 4",
      cert_1: "Sertifika 1 Başlığı",
      cert_1_sub: "Sertifika 1 Alt Bilgisi",
      cert_2_sub: "Sertifika 2 Alt Bilgisi",
      cert_3_sub: "Sertifika 3 Alt Bilgisi",
      cert_4: "Marka Tescil Belgesi Başlığı",
      cert_4_sub: "Marka Tescil Belgesi Alt Bilgisi",

      // Sustainability Section
      sustain_tag: "Döngüsel Ekonomi - Üst Yeşil Başlık",
      sustain_title: "Döngüsel Ekonomi - Büyük Bölüm Başlığı",
      sustain_subtitle: "Döngüsel Ekonomi - Alt Başlık Açıklama",
      sustain_hero_sub: "Sürdürülebilirlik Sayfası - Üst Giriş Alt Metni",
      stat_lbl_1: "Sayaç 1 - Başlık",
      stat_val_1: "Sayaç 1 - Sayısal Değer",
      stat_desc_1: "Sayaç 1 - Açıklama Metni",
      stat_lbl_2: "Sayaç 2 - Başlık",
      stat_val_2: "Sayaç 2 - Sayısal Değer",
      stat_desc_2: "Sayaç 2 - Açıklama Metni",
      stat_lbl_3: "Sayaç 3 - Başlık",
      stat_val_3: "Sayaç 3 - Sayısal Değer",
      stat_desc_3: "Sayaç 3 - Açıklama Metni",
      stat_lbl_4: "Sayaç 4 - Başlık",
      stat_val_4: "Sayaç 4 - Sayısal Değer",
      stat_desc_4: "Sayaç 4 - Açıklama Metni",
      sustain_banner_title: "Sürdürülebilirlik Afişi - Başlık",
      sustain_banner_desc: "Sürdürülebilirlik Afişi - Detay Metni",
      read_sustain: "Buton - Sürdürülebilirlik Vizyonumuz",

      // B2B Contact / Footer Info
      contact_details_title: "İletişim Bölümü - İletişim Bilgileri Başlığı",
      info_address: "Kurumsal Bilgi - Adres Etiketi",
      info_phone: "Kurumsal Bilgi - Telefon Etiketi",
      info_email: "Kurumsal Bilgi - E-posta Etiketi",
      form_toggle_general: "B2B Formu - Genel İletişim Sekmesi",
      form_toggle_quote: "B2B Formu - Teklif İsteme Sekmesi",
      err_name: "Hata Uyarısı - Geçersiz İsim",
      err_company: "Hata Uyarısı - Geçersiz Şirket",
      err_email: "Hata Uyarısı - Geçersiz E-posta",
      err_phone: "Hata Uyarısı - Geçersiz Telefon",
      err_message: "Hata Uyarısı - Boş Mesaj",
      footer_about: "Footer Alanı - Kısa Kurumsal Tanıtım",
      footer_links_title: "Footer Alanı - Hızlı Menü Başlığı",
      footer_products_title: "Footer Alanı - Ürün Grupları Başlığı",
      footer_contact_title: "Footer Alanı - İletişim Bilgileri Başlığı",
      copyright_text: "Footer Alanı - Telif Hakkı Metni",
      foot_signature: "Footer Alanı - Yeşil Dünya İmzası",
      
      // Technical parameters value overrides (for details template)
      pp_color_val: "Teknik Değer - PP Renk Seçenekleri",
      pp_usage_val: "Teknik Değer - PP Önerilen Kullanım",
      pe_color_val: "Teknik Değer - PE Renk Seçenekleri",
      pe_usage_val: "Teknik Değer - PE Önerilen Kullanım",
      custom_mfi_val: "Teknik Değer - Özel MFI Akış Hızı",
      compound_color_val: "Teknik Değer - Kompaund Renk Seçenekleri",
      compound_usage_val: "Teknik Değer - Kompaund Önerilen Kullanım",
      color_black: "Teknik Değer - Siyah",
      color_gray: "Teknik Değer - Gri",
      color_colored: "Teknik Değer - Renkli",
      color_trans: "Teknik Değer - Şeffaf/Naturel",
      color_pprc_val: "Teknik Değer - PPR-C Renk Seçenekleri",
      color_calcite_val: "Teknik Değer - Kalsit Renk Seçenekleri",
      color_custom_val: "Teknik Değer - Terzi Usulü Renk Seçenekleri",

      // Dynamic Product details description defaults (TDS keys)
      pp_100_title: "Nevra PP-100 Siyah - Detay Başlığı",
      pp_100_subtitle: "Nevra PP-100 Siyah - Alt Başlık",
      pp_100_desc: "Nevra PP-100 Siyah - TDS Açıklama Metni",
      pp_100_usage: "Nevra PP-100 Siyah - TDS Kullanım Alanları",

      pp_200_title: "Nevra PP-200 Gri - Detay Başlığı",
      pp_200_subtitle: "Nevra PP-200 Gri - Alt Başlık",
      pp_200_desc: "Nevra PP-200 Gri - TDS Açıklama Metni",
      pp_200_usage: "Nevra PP-200 Gri - TDS Kullanım Alanları",

      pp_300_title: "Nevra PP-300 Renkli - Detay Başlığı",
      pp_300_subtitle: "Nevra PP-300 Renkli - Alt Başlık",
      pp_300_desc: "Nevra PP-300 Renkli - TDS Açıklama Metni",
      pp_300_usage: "Nevra PP-300 Renkli - TDS Kullanım Alanları",

      pe_hd_title: "Nevra PE-HD Siyah - Detay Başlığı",
      pe_hd_subtitle: "Nevra PE-HD Siyah - Alt Başlık",
      pe_hd_desc: "Nevra PE-HD Siyah - TDS Açıklama Metni",
      pe_hd_usage: "Nevra PE-HD Siyah - TDS Kullanım Alanları",

      pe_ld_trans_title: "Nevra PE-LD Şeffaf - Detay Başlığı",
      pe_ld_trans_subtitle: "Nevra PE-LD Şeffaf - Alt Başlık",
      pe_ld_trans_desc: "Nevra PE-LD Şeffaf - TDS Açıklama Metni",
      pe_ld_trans_usage: "Nevra PE-LD Şeffaf - TDS Kullanım Alanları",

      pe_ld_black_title: "Nevra PE-LD Siyah - Detay Başlığı",
      pe_ld_black_subtitle: "Nevra PE-LD Siyah - Alt Başlık",
      pe_ld_black_desc: "Nevra PE-LD Siyah - TDS Açıklama Metni",
      pe_ld_black_usage: "Nevra PE-LD Siyah - TDS Kullanım Alanları",

      pprc_title: "Nevra PPR-C - Detay Başlığı",
      pprc_subtitle: "Nevra PPR-C - Alt Başlık",
      pprc_desc: "Nevra PPR-C - TDS Açıklama Metni",
      pprc_usage: "Nevra PPR-C - TDS Kullanım Alanları",

      calcite_title: "Nevra PP-Calcite - Detay Başlığı",
      calcite_subtitle: "Nevra PP-Calcite - Alt Başlık",
      calcite_desc: "Nevra PP-Calcite - TDS Açıklama Metni",
      calcite_usage: "Nevra PP-Calcite - TDS Kullanım Alanları",

      custom_title: "Nevra Custom-Mix - Detay Başlığı",
      custom_subtitle: "Nevra Custom-Mix - Alt Başlık",
      custom_desc: "Nevra Custom-Mix - TDS Açıklama Metni",
      custom_usage: "Nevra Custom-Mix - TDS Kullanım Alanları",

      // General texts
      contact_title: "İletişim Bölümü - Başlık",
      contact_subtitle: "İletişim Bölümü - Alt Metin",
      
      // Form fields
      form_product: "Teklif Formu - Hammadde Seçim Alanı Etiketi",
      form_qty: "Teklif Formu - Tüketim Miktarı Etiketi",
      form_message: "Teklif Formu - Mesaj Alanı Etiketi",
      form_name: "Teklif Formu - Ad Soyad Etiketi",
      form_company: "Teklif Formu - Şirket Adı Etiketi",
      form_email: "Teklif Formu - E-posta Etiketi",
      form_phone: "Teklif Formu - Telefon Etiketi",
      form_kvkk_text: "Teklif Formu - KVKK Onay Kutusu Metni",
      form_submit: "Teklif Formu - Gönder Butonu",
      form_submit_quote: "Teklif Formu - Teklif Al Gönder Butonu",

      // Options
      opt_pp_moblen: "Form Hammadde Seçeneği - PP Moblen",
      opt_elteks: "Form Hammadde Seçeneği - Elteks",
      opt_pprc: "Form Hammadde Seçeneği - PPRC",
      opt_other: "Form Hammadde Seçeneği - Özel Kompaundlar",

      // Details page
      modal_specs: "Ürün Detay Sayfası - Teknik Özellikler Başlığı",
      spec_mfi: "Ürün Detay Sayfası - MFI Parametre İsmi",
      spec_density: "Ürün Detay Sayfası - Yoğunluk Parametre İsmi",
      spec_color: "Ürün Detay Sayfası - Renk Seçenekleri Parametre İsmi",
      spec_usage: "Ürün Detay Sayfası - Önerilen Kullanım Parametre İsmi",
      modal_quote_btn: "Ürün Detay Sayfası - Teklif İste Butonu"
    };

    function renderTranslationsForm() {
      const container = document.getElementById("translations-container");
      if (!container) return;

      container.innerHTML = "";

      const keys = Object.keys(translationsData.tr || {});
      
      const groups = {
        "Menü & Yönlendirmeler": keys.filter(k => (k.startsWith("nav_") || k.startsWith("cta_") || k.startsWith("back_")) && !k.startsWith("img_")),
        "Hero & Anasayfa": keys.filter(k => k.startsWith("hero_") && !k.startsWith("img_")),
        "Hakkımızda & İlkeler": keys.filter(k => (k.startsWith("about_") || k.startsWith("val_")) && !k.startsWith("img_")),
        "Üretim & Aşamalar": keys.filter(k => (k.startsWith("process_") || k.startsWith("step_")) && !k.startsWith("img_")),
        "Sürdürülebilirlik & Kalite": keys.filter(k => (k.startsWith("sustain_") || k.startsWith("stat_") || k.startsWith("quality_") || k.startsWith("cert_") || k.startsWith("qual_")) && !k.startsWith("img_")),
        "Ürünler & Başlıklar": keys.filter(k => (k.startsWith("products_") || k.startsWith("modal_") || k.startsWith("spec_") || k.startsWith("opt_")) && !k.startsWith("img_") && !k.startsWith("hero_") && !k.startsWith("about_") && !k.startsWith("val_") && !k.startsWith("process_") && !k.startsWith("step_") && !k.startsWith("sustain_") && !k.startsWith("stat_") && !k.startsWith("quality_") && !k.startsWith("cert_") && !k.startsWith("qual_")),
        "İletişim & B2B Form": keys.filter(k => (k.startsWith("form_") || k.startsWith("machinery_")) && !k.startsWith("img_")),
        "Genel Metinler": keys.filter(k => 
          !k.startsWith("nav_") && !k.startsWith("cta_") && !k.startsWith("back_") && 
          !k.startsWith("products_") && !k.startsWith("modal_") && !k.startsWith("spec_") && !k.startsWith("opt_") && 
          !k.startsWith("form_") && !k.startsWith("img_") && !k.startsWith("hero_") && 
          !k.startsWith("about_") && !k.startsWith("val_") && !k.startsWith("process_") && 
          !k.startsWith("step_") && !k.startsWith("sustain_") && !k.startsWith("stat_") && 
          !k.startsWith("quality_") && !k.startsWith("cert_") && !k.startsWith("qual_") &&
          !k.startsWith("machinery_")
        )
      };

      const tabBar = document.createElement("div");
      tabBar.style.display = "flex";
      tabBar.style.flexWrap = "wrap";
      tabBar.style.gap = "0.5rem";
      tabBar.style.marginBottom = "2rem";
      tabBar.style.padding = "0.6rem";
      tabBar.style.backgroundColor = "var(--light-gray)";
      tabBar.style.borderRadius = "12px";
      tabBar.style.border = "1px solid var(--border-color)";
      container.appendChild(tabBar);

      const contentContainer = document.createElement("div");
      container.appendChild(contentContainer);

      let firstGroup = true;
      let activeBtn = null;

      Object.keys(groups).forEach(groupName => {
        const groupKeys = groups[groupName];
        if (groupKeys.length === 0) return;

        const groupDiv = document.createElement("div");
        groupDiv.style.display = firstGroup ? "block" : "none";

        const fieldsGrid = document.createElement("div");
        fieldsGrid.style.display = "flex";
        fieldsGrid.style.flexDirection = "column";
        fieldsGrid.style.gap = "1.5rem";

        groupKeys.forEach(key => {
          const trVal = translationsData.tr[key] || "";
          const enVal = (translationsData.en && translationsData.en[key]) ? translationsData.en[key] : "";
          const desc = keyDescriptions[key] || "Genel Metin";
          
          const fieldDiv = document.createElement("div");
          fieldDiv.style.padding = "1.25rem";
          fieldDiv.style.backgroundColor = "var(--light-gray)";
          fieldDiv.style.borderRadius = "8px";
          fieldDiv.style.border = "1px solid var(--border-color)";

          let trInput, enInput;
          if (key.startsWith("img_")) {
            trInput = `
              <div style="display: flex; gap: 0.5rem; align-items: center; width: 100%;">
                <input type="text" class="form-control tr-input" id="tr-img-${key}" data-key="${key}" value="${trVal}" style="flex: 1;">
                <input type="file" accept="image/*" style="display: none;" id="tr-file-${key}" onchange="uploadSiteImage('${key}', 'tr')">
                <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('tr-file-${key}').click()" style="padding: 0.5rem 0.75rem; font-size: 0.8rem; white-space: nowrap;">Yükle</button>
              </div>
            `;
            enInput = `
              <div style="display: flex; gap: 0.5rem; align-items: center; width: 100%;">
                <input type="text" class="form-control en-input" id="en-img-${key}" data-key="${key}" value="${enVal}" style="flex: 1;">
                <input type="file" accept="image/*" style="display: none;" id="en-file-${key}" onchange="uploadSiteImage('${key}', 'en')">
                <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('en-file-${key}').click()" style="padding: 0.5rem 0.75rem; font-size: 0.8rem; white-space: nowrap;">Yükle</button>
              </div>
            `;
          } else {
            const isLong = trVal.length > 55 || enVal.length > 55;
            trInput = isLong 
              ? `<textarea class="form-control tr-input" data-key="${key}" style="height: 80px; resize: vertical;">${trVal}</textarea>`
              : `<input type="text" class="form-control tr-input" data-key="${key}" value="${trVal}">`;
              
            enInput = isLong
              ? `<textarea class="form-control en-input" data-key="${key}" style="height: 80px; resize: vertical;">${enVal}</textarea>`
              : `<input type="text" class="form-control en-input" data-key="${key}" value="${enVal}">`;
          }

          fieldDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1rem;">
              <span style="font-family: monospace; font-weight: 700; color: var(--dark); font-size: 0.9rem;">${key}</span>
              <span style="font-size: 0.75rem; color: var(--primary); font-weight: 700; background: var(--primary-light); padding: 0.25rem 0.6rem; border-radius: 9999px;">${desc}</span>
            </div>
            <div class="grid-2">
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <label style="font-weight: 700; font-size: 0.8rem; color: var(--gray);">Türkçe Metin</label>
                ${trInput}
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <label style="font-weight: 700; font-size: 0.8rem; color: var(--gray);">İngilizce Metin</label>
                ${enInput}
              </div>
            </div>
          `;
          fieldsGrid.appendChild(fieldDiv);
        });

        groupDiv.appendChild(fieldsGrid);
        contentContainer.appendChild(groupDiv);

        const subTabBtn = document.createElement("button");
        subTabBtn.type = "button";
        subTabBtn.style.padding = "0.5rem 1rem";
        subTabBtn.style.fontSize = "0.82rem";
        subTabBtn.style.fontWeight = "700";
        subTabBtn.style.borderRadius = "6px";
        subTabBtn.style.border = "1px solid transparent";
        subTabBtn.style.cursor = "pointer";
        subTabBtn.style.transition = "all 0.2s ease";
        subTabBtn.textContent = groupName;

        const setSubTabActive = (btn) => {
          btn.style.backgroundColor = "var(--primary)";
          btn.style.color = "var(--white)";
          btn.style.borderColor = "var(--primary)";
        };
        const setSubTabInactive = (btn) => {
          btn.style.backgroundColor = "transparent";
          btn.style.color = "var(--gray)";
          btn.style.borderColor = "transparent";
        };

        if (firstGroup) {
          setSubTabActive(subTabBtn);
          activeBtn = subTabBtn;
        } else {
          setSubTabInactive(subTabBtn);
        }

        subTabBtn.onclick = () => {
          if (activeBtn) setSubTabInactive(activeBtn);
          setSubTabActive(subTabBtn);
          activeBtn = subTabBtn;

          Array.from(contentContainer.children).forEach(panel => {
            panel.style.display = "none";
          });
          groupDiv.style.display = "block";
        };

        tabBar.appendChild(subTabBtn);
        firstGroup = false;
      });
      renderSiteImages();
    }

    function uploadFileToServer(file, onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append("file", file);

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && onProgress) {
            const percent = (e.loaded / e.total) * 100;
            onProgress(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.status === "success") {
                resolve(res.url);
              } else {
                reject(new Error(res.message || "Bilinmeyen sunucu hatası."));
              }
            } catch (err) {
              reject(new Error("Sunucu yanıtı okunamadı."));
            }
          } else {
            reject(new Error(`Yükleme başarısız. Durum kodu: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Ağ hatası oluştu, yükleme yapılamadı."));
        });

        xhr.open("POST", "api/upload.php");
        xhr.send(formData);
      });
    }

    window.uploadSiteImage = async function(key, lang) {
      const fileInput = document.getElementById(`${lang}-file-${key}`);
      const textInput = document.getElementById(`${lang}-img-${key}`);
      const file = fileInput.files[0];
      if (!file) return;

      

      // Open progress modal
      const progressModal = document.getElementById("progress-modal");
      const progressBar = document.getElementById("progress-bar");
      const progressPercent = document.getElementById("progress-percent");
      const progressFilename = document.getElementById("progress-filename");
      if (progressModal) {
        progressFilename.textContent = file.name;
        progressBar.style.width = "0%";
        progressPercent.textContent = "0%";
        progressModal.style.display = "flex";
      }

      try {
        const fileUrl = await uploadFileToServer(file, (percent) => {
          if (progressBar) progressBar.style.width = percent + "%";
          if (progressPercent) progressPercent.textContent = Math.round(percent) + "%";
        });
        if (progressModal) progressModal.style.display = "none";
        
        textInput.value = fileUrl;
        alert("Görsel başarıyla sunucuya yüklendi! Lütfen kaydetmek için en üstteki 'Değişiklikleri Kaydet' butonuna basmayı unutmayın.");
      } catch (error) {
        if (progressModal) progressModal.style.display = "none";
        window.showDebugError("Görsel Yükleme (Sunucu)", error);
        alert("Görsel yükleme hatası! Detaylar için sağ alttaki Hata Ayıklayıcı panelini kontrol edin.");
      }
    };

    async function saveTranslations() {
      const trInputs = document.querySelectorAll("#translations-container .tr-input");
      const enInputs = document.querySelectorAll("#translations-container .en-input");

      const newTr = {};
      const newEn = {};

      trInputs.forEach(input => {
        const key = input.getAttribute("data-key");
        newTr[key] = input.value;
      });

      enInputs.forEach(input => {
        const key = input.getAttribute("data-key");
        newEn[key] = input.value;
      });

      const updatedTranslations = {
        tr: newTr,
        en: newEn
      };

      try {
        const response = await fetch('api/cms.php?action=save_translations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTranslations)
        });
        const resData = await response.json();
        if (response.ok && resData.status === 'success') {
          alert("Site metinleri ve çeviriler başarıyla güncellendi.");
          translationsData = updatedTranslations;
          renderTranslationsForm();
        } else {
          throw new Error(resData.message || "Kaydetme hatası.");
        }
      } catch (error) {
        window.showDebugError("Metin Güncelleme", error);
        alert("Metinler kaydedilirken hata oluştu! Detaylar için sağ alttaki Hata Ayıklayıcı panelini kontrol edin.");
      }
    }

    // --- Dedicated Site Images Management Tab ---
    const siteImageKeys = {
      img_logo: { title: "Kurumsal Logo", desc: "Tüm sayfalarda görünen Nevra Plastik logosu (.svg, .png vb.)" },
      img_hero: { title: "Anasayfa Hero Görseli", desc: "Anasayfa en üst sağ taraftaki büyük banner görseli" },
      img_about: { title: "Hakkımızda / Tesis Görseli", desc: "Hakkımızda sayfası ve anasayfa özetindeki büyük tesis görseli" },
      img_sustain: { title: "Sürdürülebilirlik Görseli", desc: "Sürdürülebilirlik sayfasındaki döngüsel ekonomi görseli" },
      img_quality: { title: "Kalite Kontrol Görseli", desc: "Kalite & Sertifikalar sayfasındaki laboratuvar görseli" }
    };

    window.renderSiteImages = function() {
      const container = document.getElementById("site-images-container");
      if (!container) return;

      container.innerHTML = "";

      Object.keys(siteImageKeys).forEach(key => {
        const trVal = translationsData.tr[key] || "assets/logo.svg";
        const enVal = (translationsData.en && translationsData.en[key]) ? translationsData.en[key] : trVal;
        const config = siteImageKeys[key];

        const card = document.createElement("div");
        card.className = "card";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.gap = "1.25rem";
        card.style.padding = "1.5rem";
        card.style.borderLeft = "4px solid var(--primary)";

        card.innerHTML = `
          <div>
            <h3 style="font-family: 'Plus Jakarta Sans'; font-weight: 700; font-size: 1.1rem; color: var(--dark);">${config.title}</h3>
            <p style="font-size: 0.8rem; color: var(--gray); margin-top: 0.25rem;">${config.desc}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <!-- TR Visual Panel -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary);">Türkçe (TR) Görsel</span>
              <div style="height: 120px; background: #f8fafc; border-radius: 8px; border: 1px dashed var(--border-color); display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 4px;">
                <img id="preview-tr-${key}" src="${trVal}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" class="form-control" id="url-tr-${key}" value="${trVal}" style="font-size: 0.8rem; height: 32px;" onchange="updateImagePreview('${key}', 'tr')">
                <input type="file" accept="image/*" style="display: none;" id="file-tr-${key}" onchange="uploadDashboardImage('${key}', 'tr')">
                <button type="button" class="btn btn-outline btn-sm" id="btn-upload-tr-${key}" onclick="document.getElementById('file-tr-${key}').click()" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; white-space: nowrap;">Seç/Yükle</button>
              </div>
            </div>

            <!-- EN Visual Panel -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary);">İngilizce (EN) Görsel</span>
              <div style="height: 120px; background: #f8fafc; border-radius: 8px; border: 1px dashed var(--border-color); display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 4px;">
                <img id="preview-en-${key}" src="${enVal}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" class="form-control" id="url-en-${key}" value="${enVal}" style="font-size: 0.8rem; height: 32px;" onchange="updateImagePreview('${key}', 'en')">
                <input type="file" accept="image/*" style="display: none;" id="file-en-${key}" onchange="uploadDashboardImage('${key}', 'en')">
                <button type="button" class="btn btn-outline btn-sm" id="btn-upload-en-${key}" onclick="document.getElementById('file-en-${key}').click()" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; white-space: nowrap;">Seç/Yükle</button>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button type="button" class="btn btn-outline btn-sm" onclick="syncLanguageImage('${key}')" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">
              Türkçe Görselini İngilizceye Kopyala
            </button>
          </div>
        `;
        container.appendChild(card);
      });
    };

    window.updateImagePreview = function(key, lang) {
      const urlInput = document.getElementById(`url-${lang}-${key}`);
      const imgPreview = document.getElementById(`preview-${lang}-${key}`);
      if (urlInput && imgPreview) {
        imgPreview.src = urlInput.value;
      }
    };

    window.syncLanguageImage = function(key) {
      const trUrl = document.getElementById(`url-tr-${key}`).value;
      const enUrlInput = document.getElementById(`url-en-${key}`);
      const enPreview = document.getElementById(`preview-en-${key}`);
      if (enUrlInput && enPreview) {
        enUrlInput.value = trUrl;
        enPreview.src = trUrl;
      }
    };

    window.uploadDashboardImage = async function(key, lang) {
      const btn = document.getElementById(`btn-upload-${lang}-${key}`);
      const fileInput = document.getElementById(`file-${lang}-${key}`);
      const urlInput = document.getElementById(`url-${lang}-${key}`);
      const previewImg = document.getElementById(`preview-${lang}-${key}`);
      
      const file = fileInput.files[0];
      if (!file) return;

      

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Yükleniyor...";
        btn.style.opacity = "0.7";
      }

      // Open progress modal
      const progressModal = document.getElementById("progress-modal");
      const progressBar = document.getElementById("progress-bar");
      const progressPercent = document.getElementById("progress-percent");
      const progressFilename = document.getElementById("progress-filename");
      
      if (progressModal) {
        progressFilename.textContent = file.name;
        progressBar.style.width = "0%";
        progressPercent.textContent = "0%";
        progressModal.style.display = "flex";
      }

      try {
        const ref = storage.ref().child(`products/site_${key}_${lang}_${Date.now()}_${file.name}`);
        const uploadTask = ref.put(file);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progressBar) progressBar.style.width = progress + "%";
            if (progressPercent) progressPercent.textContent = Math.round(progress) + "%";
          }, 
          (error) => {
            if (progressModal) progressModal.style.display = "none";
            window.showDebugError("Görsel Yükleme (Storage)", error);
            alert("Görsel yükleme hatası! Detaylar için sağ alttaki Hata Ayıklayıcı panelini kontrol edin.");
            if (btn) {
              btn.disabled = false;
              btn.textContent = "Seç/Yükle";
              btn.style.opacity = "1";
            }
          }, 
          async () => {
            if (progressModal) progressModal.style.display = "none";
            try {
              const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
              urlInput.value = downloadUrl;
              previewImg.src = downloadUrl;
              alert("Görsel başarıyla Firebase Storage'a yüklendi! Lütfen kaydetmek için sağ üstteki 'Görselleri Kaydet' butonuna basmayı unutmayın.");
            } catch (err) {
              window.showDebugError("Görsel URL Alımı", err);
            } finally {
              if (btn) {
                btn.disabled = false;
                btn.textContent = "Seç/Yükle";
                btn.style.opacity = "1";
              }
            }
          }
        );
      } catch (error) {
        if (progressModal) progressModal.style.display = "none";
        window.showDebugError("Görsel Yükleme Tetikleme", error);
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Seç/Yükle";
          btn.style.opacity = "1";
        }
      }
    };

    window.saveSiteImages = async function() {
      const trUpdated = {};
      const enUpdated = {};

      Object.keys(siteImageKeys).forEach(key => {
        const trVal = document.getElementById(`url-tr-${key}`).value;
        const enVal = document.getElementById(`url-en-${key}`).value;
        
        trUpdated[key] = trVal;
        enUpdated[key] = enVal;
      });

      // Merge into translationsData
      translationsData.tr = { ...translationsData.tr, ...trUpdated };
      translationsData.en = { ...translationsData.en, ...enUpdated };

      try {
          const response = await fetch('api/cms.php?action=save_translations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(translationsData)
          });
          const resData = await response.json();
          if (response.ok && resData.status === 'success') {
            alert("Site görselleri başarıyla kaydedildi ve yayınlandı.");
            loadTranslations();
          } else {
            throw new Error(resData.message || "Görsel kaydetme hatası.");
          }
        } catch (error) {
          window.showDebugError("Görsel Kaydetme", error);
          alert("Görsel kaydedilirken hata oluştu! Detaylar için sağ alttaki Hata Ayıklayıcı panelini kontrol edin.");
        }
    };

    // --- Machinery Operations ---
    function renderMachinesTable() {
      const tbody = document.querySelector("#machines-table tbody");
      if (!tbody) return;
      tbody.innerHTML = "";
      
      machinesList.forEach(mach => {
        const tr = document.createElement("tr");
        const statusBadge = mach.status === 'passive' 
          ? '<span class="badge status-badge-animate" style="background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; font-size: 0.72rem; margin-left: 0.5rem; padding: 2px 6px;">Pasif</span>' 
          : '<span class="badge status-badge-animate" style="background: #dcfce7; color: #22c55e; border: 1px solid #86efac; font-size: 0.72rem; margin-left: 0.5rem; padding: 2px 6px;">Aktif</span>';

        tr.innerHTML = `
          <td><img src="${mach.image || 'assets/product-pp.png'}" class="thumb-preview" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-color);"></td>
          <td>
            <strong>${mach.name_tr}</strong>${statusBadge}<br>
            <span style="font-size: 0.8rem; color: var(--gray);">EN: ${mach.name_en}</span>
          </td>
          <td style="font-size: 0.85rem; color: var(--gray); max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${mach.desc_tr}</td>
          <td style="text-align: center;">
            <label class="status-switch-container" title="Sitede Göster / Gizle">
              <div class="status-switch">
                <input type="checkbox" ${mach.status !== 'passive' ? 'checked' : ''} onchange="toggleMachineStatus('${mach.id}', this.checked)">
                <span class="status-slider"></span>
              </div>
            </label>
          </td>
          <td>
            <div style="display: flex; gap: 0.5rem; justify-content: center;">
              <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="editMachine('${mach.id}')">Düzenle</button>
              <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="deleteMachine('${mach.id}')">Sil</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    window.openMachineModal = function() {
      document.getElementById("machine-form").reset();
      document.getElementById("mach-id").value = "";
      document.getElementById("mach-status").value = "active";
      document.getElementById("machine-modal-title").textContent = "Yeni Makine Ekle";
      document.getElementById("modal-mach-img-preview").src = "assets/product-pp.png";
      document.getElementById("machine-modal").classList.add("show");
    }        ;

    window.closeMachineModal = function() {
      document.getElementById("machine-modal").classList.remove("show");
    };

    window.triggerMachineImageUpload = function() {
      document.getElementById("mach-image-file").click();
    };

    window.handleMachineImageUpload = async function(input) {
      if (!input.files || input.files.length === 0) return;
      const file = input.files[0];
      
      const progressModal = document.getElementById("progress-modal");
      const progressBar = document.getElementById("progress-bar");
      const progressPercent = document.getElementById("progress-percent");
      const progressFilename = document.getElementById("progress-filename");
      if (progressModal) {
        progressFilename.textContent = file.name;
        progressBar.style.width = "0%";
        progressPercent.textContent = "0%";
        progressModal.style.display = "flex";
      }
      
      try {
        const fileUrl = await uploadFileToServer(file, (percent) => {
          if (progressBar) progressBar.style.width = percent + "%";
          if (progressPercent) progressPercent.textContent = Math.round(percent) + "%";
        });
        document.getElementById("mach-image").value = fileUrl;
        document.getElementById("modal-mach-img-preview").src = fileUrl;
      } catch (err) {
        console.error(err);
        alert("Görsel yüklenirken hata oluştu: " + err.message);
      } finally {
        if (progressModal) progressModal.style.display = "none";
      }
    };

    window.editMachine = function(id) {
      const mach = machinesList.find(m => m.id === id);
      if (!mach) return;

      document.getElementById("mach-id").value = mach.id;
      document.getElementById("mach-name-tr").value = mach.name_tr;
      document.getElementById("mach-name-en").value = mach.name_en;
      document.getElementById("mach-desc-tr").value = mach.desc_tr;
      document.getElementById("mach-desc-en").value = mach.desc_en;
      document.getElementById("mach-detail-tr").value = mach.detail_tr || "";
      document.getElementById("mach-detail-en").value = mach.detail_en || "";
      document.getElementById("mach-features-tr").value = mach.features_tr || "";
      document.getElementById("mach-features-en").value = mach.features_en || "";
      document.getElementById("mach-image").value = mach.image || "";
      document.getElementById("modal-mach-img-preview").src = mach.image || "assets/product-pp.png";
      document.getElementById("mach-status").value = mach.status || "active";
      
      document.getElementById("machine-modal-title").textContent = "Makine Düzenle";
      document.getElementById("machine-modal").classList.add("show");
    };

    window.deleteMachine = async function(id) {
      if (!confirm("Bu makineyi silmek istediğinize emin misiniz?")) return;
      try {
        const response = await fetch(`api/cms.php?action=delete_machine&id=${id}`, {
          method: 'POST'
        });
        const resData = await response.json();
        if (response.ok && resData.status === 'success') {
          alert("Makine başarıyla silindi.");
          loadCMSData();
        } else {
          throw new Error(resData.message || "Silme hatası.");
        }
      } catch (error) {
        window.showDebugError("Makine Silme", error);
        alert("Hata oluştu! Detaylar için debug panelini inceleyin.");
      }
    };

    window.saveMachineForm = async function(event) {
      event.preventDefault();
      
      let id = document.getElementById("mach-id").value;
      if (!id) {
        id = "mach_" + Date.now();
      }
      
      const machineData = {
        id: id,
        name_tr: document.getElementById("mach-name-tr").value.trim() || "-",
        name_en: document.getElementById("mach-name-en").value.trim() || "-",
        desc_tr: document.getElementById("mach-desc-tr").value.trim() || "-",
        desc_en: document.getElementById("mach-desc-en").value.trim() || "-",
        detail_tr: document.getElementById("mach-detail-tr").value.trim() || "-",
        detail_en: document.getElementById("mach-detail-en").value.trim() || "-",
        features_tr: document.getElementById("mach-features-tr").value.trim() || "-",
        features_en: document.getElementById("mach-features-en").value.trim() || "-",
        image: document.getElementById("mach-image").value.trim() || "assets/product-pp.png",
        status: document.getElementById("mach-status").value
      };

      try {
        const response = await fetch(`api/cms.php?action=save_machine&id=${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(machineData)
        });
        const resData = await response.json();
        if (response.ok && resData.status === 'success') {
          alert("Makine başarıyla kaydedildi.");
          closeMachineModal();
          loadCMSData();
        } else {
          throw new Error(resData.message || "Kaydetme hatası.");
        }
      } catch (error) {
        window.showDebugError("Makine Kaydetme", error);
        alert("Hata oluştu! Detaylar için debug panelini inceleyin.");
      }
    };

    // --- Contact Form Operations ---
    function renderContactsTable() {
      const tbody = document.querySelector("#contacts-table tbody");
      if (!tbody) return;
      tbody.innerHTML = "";
      
      const sortedContacts = [...contactsList].sort((a, b) => {
        return new Date(b.date || 0) - new Date(a.date || 0);
      });
      
      if (sortedContacts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--gray); padding: 3rem;">Henüz kayıtlı iletişim formu bulunmamaktadır.</td></tr>`;
        return;
      }

      sortedContacts.forEach(c => {
        const tr = document.createElement("tr");
        let badgeClass = 'badge-pe';
        let purposeText = 'Genel İletişim';
        if (c.purpose === 'quote') {
          badgeClass = 'badge-pp';
          purposeText = 'Hammadde Teklifi';
        } else if (c.purpose === 'quote_machine') {
          badgeClass = 'badge-pprc';
          purposeText = 'Makine Teklifi';
        }
        
        let productText = "-";
        if (c.purpose === 'quote') {
          const prodCode = c.product ? c.product.toUpperCase() : "DİĞER";
          const qtyText = c.qty ? `${c.qty} Ton` : "Belirtilmemiş";
          productText = `<strong>${prodCode}</strong><br><span style="font-size: 0.8rem; color: var(--gray);">${qtyText} / Ay</span>`;
        } else if (c.purpose === 'quote_machine') {
          const machCode = c.machine ? c.machine.toUpperCase().replace(/_/g, " ") : "DİĞER";
          const capacityText = c.capacity ? c.capacity : "Belirtilmemiş";
          productText = `<strong>${machCode}</strong><br><span style="font-size: 0.8rem; color: var(--gray);">${capacityText}</span>`;
        }

        tr.innerHTML = `
          <td style="font-size: 0.85rem; white-space: nowrap;"><code>${c.date || ''}</code></td>
          <td><span class="badge ${badgeClass}">${purposeText}</span></td>
          <td>
            <strong>${c.name}</strong><br>
            <span style="font-size: 0.82rem; color: var(--gray);">${c.company || '-'}</span>
          </td>
          <td style="font-size: 0.85rem;">
            <a href="mailto:${c.email}">${c.email}</a><br>
            <span style="color: var(--gray);">${c.phone || '-'}</span>
          </td>
          <td style="font-size: 0.85rem;">${productText}</td>
          <td>
            <div style="max-width: 300px; max-height: 80px; overflow-y: auto; font-size: 0.85rem; color: var(--gray); white-space: pre-wrap; line-height: 1.4;">${c.message || ''}</div>
          </td>
          <td>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openContactDetailModal('${c.id}')">İncele</button>
              <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="deleteContactSubmission('${c.id}')">Sil</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    window.deleteContactSubmission = async function(id) {
      if (!confirm("Bu mesaj kaydını silmek istediğinize emin misiniz?")) return;
      try {
        const response = await fetch(`api/cms.php?action=delete_contact&id=${id}`, {
          method: 'POST'
        });
        const resData = await response.json();
        if (response.ok && resData.status === 'success') {
          alert("Kayıt başarıyla silindi.");
          loadCMSData();
        } else {
          throw new Error(resData.message || "Silme hatası.");
        }
      } catch (error) {
        window.showDebugError("Mesaj Silme", error);
        alert("Hata oluştu! Detaylar için debug panelini inceleyin.");
      }
    };

    window.openContactDetailModal = function(id) {
      const contact = contactsList.find(c => c.id === id);
      if (!contact) return;
      
      const modal = document.getElementById("contact-detail-modal");
      const title = document.getElementById("contact-detail-title");
      const body = document.getElementById("contact-detail-body");
      if (!modal || !body || !title) return;
      
      let purposeText = 'Genel İletişim';
      let badgeClass = 'badge-pe';
      if (contact.purpose === 'quote') {
        purposeText = 'Hammadde Fiyat Teklifi';
        badgeClass = 'badge-pp';
      } else if (contact.purpose === 'quote_machine') {
        purposeText = 'Makine Fiyat Teklifi';
        badgeClass = 'badge-pprc';
      }
      
      title.textContent = `${contact.name} - ${purposeText}`;
      
      let productDetailsHTML = '';
      if (contact.purpose === 'quote') {
        const prod = contact.product ? contact.product.toUpperCase() : "DİĞER";
        const qty = contact.qty ? `${contact.qty} Ton / Ay` : "Belirtilmemiş";
        productDetailsHTML = `
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-weight: 700; color: var(--gray);">Talep Edilen:</span>
            <strong>${prod}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-weight: 700; color: var(--gray);">Aylık Tüketim:</span>
            <strong>${qty}</strong>
          </div>
        `;
      } else if (contact.purpose === 'quote_machine') {
        const mach = contact.machine ? contact.machine.toUpperCase().replace(/_/g, " ") : "DİĞER";
        const capacity = contact.capacity ? contact.capacity : "Belirtilmemiş";
        productDetailsHTML = `
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-weight: 700; color: var(--gray);">Talep Edilen Makine:</span>
            <strong>${mach}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-weight: 700; color: var(--gray);">Kapasite / Adet:</span>
            <strong>${capacity}</strong>
          </div>
        `;
      }
      
      body.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.95rem; text-align: left;">
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-weight: 700; color: var(--gray);">Tarih:</span>
            <code>${contact.date || '-'}</code>
          </div>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-weight: 700; color: var(--gray);">Talep Türü:</span>
            <div><span class="badge ${badgeClass}">${purposeText}</span></div>
          </div>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-weight: 700; color: var(--gray);">Gönderen:</span>
            <strong>${contact.name}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-weight: 700; color: var(--gray);">Şirket:</span>
            <span>${contact.company || '-'}</span>
          </div>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-weight: 700; color: var(--gray);">E-posta:</span>
            <a href="mailto:${contact.email}">${contact.email}</a>
          </div>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.75rem;">
            <span style="font-weight: 700; color: var(--gray);">Telefon:</span>
            <span>${contact.phone || '-'}</span>
          </div>
          ${productDetailsHTML}
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem; text-align: left;">
            <span style="font-weight: 700; color: var(--gray);">Mesaj Detayı:</span>
            <div style="background: var(--light-gray); padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border-color); white-space: pre-wrap; line-height: 1.6; color: var(--dark); font-size: 0.92rem;">${contact.message || ''}</div>
          </div>
        </div>
      `;
      
      modal.classList.add("show");
    };
    
    window.closeContactDetailModal = function() {
      const modal = document.getElementById("contact-detail-modal");
      if (modal) modal.classList.remove("show");
    };

    // --- Floating Debugger Functions ---
    window.showDebugError = function(context, err) {
      const dbg = document.getElementById("cms-debugger");
      const log = document.getElementById("debugger-log");
      if (!dbg || !log) return;
      
      const errCode = err.code || "UNKNOWN_ERROR";
      const errMsg = err.message || err.toString();
      
      log.innerHTML = `
        <div style="color: #94a3b8; font-weight: bold; border-bottom: 1px dashed #334155; padding-bottom: 0.25rem;">Kategori/Bağlam: ${context}</div>
        <div style="color: #f43f5e; font-weight: bold; margin-top: 0.25rem;">Hata Kodu: ${errCode}</div>
        <div style="color: #e2e8f0; word-break: break-all; white-space: pre-wrap; margin-top: 0.25rem; background: #1e293b; padding: 0.5rem; border-radius: 4px;">Mesaj: ${errMsg}</div>
        <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.5rem; text-align: right;">Zaman: ${new Date().toLocaleTimeString()}</div>
      `;
      dbg.style.transform = "translateY(0)";
    };

    window.closeDebugger = function() {
      const dbg = document.getElementById("cms-debugger");
      if (dbg) dbg.style.transform = "translateY(150%)";
    };

    // --- Theme Switcher Logic ---
    const themeToggleBtn = document.getElementById("theme-toggle-btn");

    function updateThemeUI(theme) {
      const wrapper = document.querySelector("#theme-toggle-btn .theme-icon-wrapper");
      const sunIcon = document.querySelector("#theme-toggle-btn .sun");
      const moonIcon = document.querySelector("#theme-toggle-btn .moon");
      
      if (theme === "dark") {
        document.body.classList.add("dark-theme");
        if (themeToggleBtn) {
          themeToggleBtn.setAttribute("title", "Açık Temaya Geç");
          themeToggleBtn.style.color = "#f1f5f9";
          themeToggleBtn.style.borderColor = "rgba(255, 255, 255, 0.15)";
        }
        if (wrapper) wrapper.style.transform = "rotate(360deg)";
        if (sunIcon) {
          sunIcon.style.opacity = "0";
          sunIcon.style.transform = "rotate(-90deg) scale(0.5)";
        }
        if (moonIcon) {
          moonIcon.style.opacity = "1";
          moonIcon.style.transform = "rotate(0) scale(1)";
        }
      } else {
        document.body.classList.remove("dark-theme");
        if (themeToggleBtn) {
          themeToggleBtn.setAttribute("title", "Karanlık Temaya Geç");
          themeToggleBtn.style.color = "#334155";
          themeToggleBtn.style.borderColor = "rgba(0, 0, 0, 0.15)";
        }
        if (wrapper) wrapper.style.transform = "rotate(0deg)";
        if (sunIcon) {
          sunIcon.style.opacity = "1";
          sunIcon.style.transform = "rotate(0) scale(1)";
        }
        if (moonIcon) {
          moonIcon.style.opacity = "0";
          moonIcon.style.transform = "rotate(90deg) scale(0.5)";
        }
      }
    }

    // Load initial theme (Default to dark theme if not saved yet)
    const savedTheme = localStorage.getItem("admin_theme") || "dark";
    updateThemeUI(savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-theme");
        const newTheme = isDark ? "light" : "dark";
        localStorage.setItem("admin_theme", newTheme);
        updateThemeUI(newTheme);
      });
    }
  