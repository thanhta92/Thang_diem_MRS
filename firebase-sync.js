/**
 * Bảng Đánh Giá Mãn Kinh MRS (Menopause Rating Scale)
 * Firebase Realtime Cloud Sync Module (firebase-sync.js)
 * Đồng bộ dữ liệu 2 chiều thời gian thực giữa nhiều thiết bị (iPad, Điện thoại, Máy tính)
 */

(function (window) {
  'use strict';

  const DEFAULT_FIREBASE_CONFIG_KEY = 'mrs_firebase_config_v1';
  const CLOUD_COLLECTION_NAME = 'mrs_evaluations';

  // Cấu hình Firebase Realtime Database mặc định
  const DEFAULT_CONFIG = {
    apiKey: "",
    authDomain: "",
    databaseURL: "https://tina-phanquyen-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tina-phanquyen",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };

  const MrsFirebase = {
    app: null,
    db: null,
    isConnected: false,
    isSyncing: false,
    listenersAttached: false,

    // Lấy config đã lưu hoặc config mặc định
    getConfig() {
      try {
        const saved = localStorage.getItem(DEFAULT_FIREBASE_CONFIG_KEY);
        if (saved) {
          return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.warn('[CloudSync] Lỗi đọc Firebase config:', e);
      }
      return { ...DEFAULT_CONFIG };
    },

    // Lưu config mới vào LocalStorage
    saveConfig(cfg) {
      try {
        localStorage.setItem(DEFAULT_FIREBASE_CONFIG_KEY, JSON.stringify(cfg));
        return true;
      } catch (e) {
        console.error('[CloudSync] Lỗi lưu Firebase config:', e);
        return false;
      }
    },

    // Kiểm tra config có hợp lệ không
    hasValidConfig() {
      const cfg = this.getConfig();
      return !!(cfg && (cfg.databaseURL || cfg.projectId || cfg.apiKey));
    },

    // Khởi tạo Firebase SDK & Kết nối Realtime
    init() {
      const cfg = this.getConfig();

      // Kiểm tra thư viện Firebase SDK đã tải chưa
      if (typeof firebase === 'undefined') {
        console.warn('[CloudSync] Firebase SDK chưa được tải vào trang.');
        this.updateUIStatus('offline', 'Chưa tải SDK');
        return false;
      }

      if (!cfg.databaseURL && !cfg.projectId) {
        console.info('[CloudSync] Chưa có cấu hình Firebase Database URL.');
        this.updateUIStatus('unconfigured', 'Chưa cấu hình');
        return false;
      }

      try {
        // Tránh khởi tạo nhiều lần
        if (!firebase.apps || !firebase.apps.length) {
          this.app = firebase.initializeApp(cfg);
        } else {
          this.app = firebase.app();
        }

        this.db = firebase.database();
        this.updateUIStatus('connecting', 'Đang kết nối...');

        this.attachRealtimeListeners();

        // Giám sát trạng thái kết nối mạng đến Firebase
        const connectedRef = this.db.ref('.info/connected');
        connectedRef.on('value', (snap) => {
          if (snap.val() === true) {
            this.isConnected = true;
            console.log('[CloudSync] Kết nối Firebase Realtime Database thành công!');
            this.updateUIStatus('online', 'Cloud Realtime');
            // Kéo dữ liệu mới nhất từ cloud về
            this.pullAllFromCloud(false);
          } else {
            this.isConnected = false;
            console.log('[CloudSync] Ngoại tuyến hoặc đang ngắt kết nối Cloud.');
            this.updateUIStatus('offline', 'Ngoại tuyến');
          }
        });

        return true;
      } catch (err) {
        console.error('[CloudSync] Lỗi khởi tạo Firebase:', err);
        this.updateUIStatus('error', 'Lỗi kết nối');
        return false;
      }
    },

    // Cập nhật trạng thái hiển thị trên Toolbar & Modal
    updateUIStatus(status, text) {
      const badge = document.getElementById('cloud-sync-status');
      if (badge) {
        badge.className = `cloud-sync-badge status-${status}`;
        badge.innerHTML = `<span class="sync-dot"></span> <span class="sync-text">${text}</span>`;
        badge.setAttribute('data-status', status);
      }

      const modalStatusText = document.getElementById('cloud-modal-status-text');
      if (modalStatusText) {
        modalStatusText.textContent = text;
      }

      const modalStatusBadge = document.getElementById('cloud-modal-status-badge');
      if (modalStatusBadge) {
        modalStatusBadge.className = `cloud-status-tag status-${status}`;
      }
    },

    // Lắng nghe thay đổi thời gian thực từ Cloud
    attachRealtimeListeners() {
      if (this.listenersAttached || !this.db) return;
      this.listenersAttached = true;

      const evalsRef = this.db.ref(CLOUD_COLLECTION_NAME);
      evalsRef.on('value', (snapshot) => {
        const cloudData = snapshot.val();
        const list = cloudData ? (Array.isArray(cloudData) ? cloudData : Object.values(cloudData)) : [];
        this.mergeEvaluationsFromCloud(list);
      }, (error) => {
        console.warn('[CloudSync] Lỗi lắng nghe evaluations:', error);
        this.updateUIStatus('error', 'Lỗi đồng bộ');
      });
    },

    // Gộp dữ liệu đánh giá từ Cloud vào LocalStorage
    mergeEvaluationsFromCloud(cloudList) {
      try {
        const cleanCloudList = Array.isArray(cloudList) ? cloudList.filter(item => item && item.id) : [];
        
        // Đọc danh sách local hiện tại
        const localList = typeof getStoredRecords === 'function' ? getStoredRecords() : [];

        // Hợp nhất dữ liệu có xem xét Deduplication theo (Họ tên + Năm sinh + Ngày đánh giá)
        // và lưu bản ghi có updatedAt / createdAt mới nhất
        const recordMap = new Map();

        // 1. Nạp local records trước
        localList.forEach(rec => {
          if (!rec) return;
          const key = rec.evalKey || (typeof getEvaluationKey === 'function' ? getEvaluationKey(rec.name, rec.birthYear, rec.date) : rec.id);
          recordMap.set(key, rec);
        });

        // 2. Nạp/Ghi đè cloud records nếu mới hơn hoặc chưa có
        cleanCloudList.forEach(cloudRec => {
          if (!cloudRec) return;
          const key = cloudRec.evalKey || (typeof getEvaluationKey === 'function' ? getEvaluationKey(cloudRec.name, cloudRec.birthYear, cloudRec.date) : cloudRec.id);
          
          if (!recordMap.has(key)) {
            recordMap.set(key, cloudRec);
          } else {
            const existing = recordMap.get(key);
            const timeCloud = new Date(cloudRec.updatedAt || cloudRec.createdAt || 0).getTime();
            const timeLocal = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
            // Nếu cloud mới hơn hoặc bằng thì ưu tiên cloud
            if (timeCloud >= timeLocal) {
              recordMap.set(key, cloudRec);
            }
          }
        });

        // Chuyển Map thành mảng và sắp xếp mới nhất lên đầu
        const mergedList = Array.from(recordMap.values());
        mergedList.sort((a, b) => {
          const timeA = new Date(a.updatedAt || a.createdAt || a.date || 0).getTime();
          const timeB = new Date(b.updatedAt || b.createdAt || b.date || 0).getTime();
          return timeB - timeA;
        });

        // Lưu vào LocalStorage
        if (typeof setStoredRecords === 'function') {
          // Lưu ngầm không bắn alert
          try {
            localStorage.setItem(MRS_CONFIG.storageKey, JSON.stringify(mergedList));
            if (typeof updateHistoryBadge === 'function') updateHistoryBadge();
          } catch (e) {
            console.error('[CloudSync] Lỗi lưu LocalStorage khi gộp:', e);
          }
        }

        // Bắn sự kiện cập nhật giao diện
        window.dispatchEvent(new CustomEvent('mrs-data-synced', {
          detail: { count: mergedList.length }
        }));

        // Cập nhật lại danh sách và thống kê nếu modal đang mở
        if (typeof renderHistoryList === 'function' && document.getElementById('history-modal')?.classList.contains('active')) {
          renderHistoryList();
          if (typeof renderStatistics === 'function') renderStatistics();
        }

      } catch (err) {
        console.error('[CloudSync] Lỗi trong quá trình mergeEvaluationsFromCloud:', err);
      }
    },

    // Lưu hoặc Cập nhật 1 bản ghi đánh giá lên Cloud
    async saveEvaluation(record) {
      if (!this.db || !record || !record.id) return false;
      this.updateUIStatus('syncing', 'Đang lưu...');
      try {
        const cleanRecord = JSON.parse(JSON.stringify(record));
        await this.db.ref(`${CLOUD_COLLECTION_NAME}/${cleanRecord.id}`).set(cleanRecord);
        console.log('[CloudSync] Đã lưu đánh giá lên Cloud:', cleanRecord.id);
        this.updateUIStatus('online', 'Cloud Realtime');
        return true;
      } catch (e) {
        console.error('[CloudSync] Lỗi lưu đánh giá lên Cloud:', e);
        this.updateUIStatus('error', 'Lỗi đẩy dữ liệu');
        return false;
      }
    },

    // Xóa 1 bản ghi đánh giá trên Cloud
    async deleteEvaluation(id) {
      if (!this.db || !id) return false;
      this.updateUIStatus('syncing', 'Đang xoá...');
      try {
        await this.db.ref(`${CLOUD_COLLECTION_NAME}/${id}`).remove();
        console.log('[CloudSync] Đã xóa đánh giá trên Cloud:', id);
        this.updateUIStatus('online', 'Cloud Realtime');
        return true;
      } catch (e) {
        console.error('[CloudSync] Lỗi xóa đánh giá trên Cloud:', e);
        this.updateUIStatus('error', 'Lỗi xoá Cloud');
        return false;
      }
    },

    // Xóa tất cả đánh giá trên Cloud
    async clearAllEvaluations() {
      if (!this.db) return false;
      this.updateUIStatus('syncing', 'Đang xoá...');
      try {
        await this.db.ref(CLOUD_COLLECTION_NAME).remove();
        console.log('[CloudSync] Đã xóa toàn bộ đánh giá trên Cloud');
        this.updateUIStatus('online', 'Cloud Realtime');
        return true;
      } catch (e) {
        console.error('[CloudSync] Lỗi xóa toàn bộ trên Cloud:', e);
        this.updateUIStatus('error', 'Lỗi xoá Cloud');
        return false;
      }
    },

    // Đẩy TOÀN BỘ dữ liệu từ Local lên Cloud (Thủ công / Khởi tạo máy mới)
    async pushAllLocalToCloud() {
      if (!this.db) {
        alert('Chưa kết nối được Firebase Cloud Database. Vui lòng kiểm tra lại cấu hình!');
        return false;
      }

      this.isSyncing = true;
      this.updateUIStatus('syncing', 'Đang tải lên...');

      try {
        const evals = typeof getStoredRecords === 'function' ? getStoredRecords() : [];
        if (evals.length === 0) {
          this.updateUIStatus('online', 'Cloud Realtime');
          this.isSyncing = false;
          return true;
        }

        const evalsMap = {};
        evals.forEach(item => {
          if (item && item.id) {
            evalsMap[item.id] = item;
          }
        });

        await this.db.ref(CLOUD_COLLECTION_NAME).update(evalsMap);

        this.updateUIStatus('online', 'Cloud Realtime');
        this.isSyncing = false;
        return true;
      } catch (e) {
        console.error('[CloudSync] Lỗi pushAllLocalToCloud:', e);
        this.updateUIStatus('error', 'Lỗi đồng bộ');
        this.isSyncing = false;
        return false;
      }
    },

    // Kéo TOÀN BỘ dữ liệu từ Cloud về Local (Thủ công)
    async pullAllFromCloud(showFeedback = true) {
      if (!this.db) return false;

      this.isSyncing = true;
      this.updateUIStatus('syncing', 'Đang tải về...');

      try {
        const snapEvals = await this.db.ref(CLOUD_COLLECTION_NAME).once('value');
        const cloudData = snapEvals.val();
        const list = cloudData ? (Array.isArray(cloudData) ? cloudData : Object.values(cloudData)) : [];
        this.mergeEvaluationsFromCloud(list);

        this.updateUIStatus('online', 'Cloud Realtime');
        this.isSyncing = false;
        return true;
      } catch (e) {
        console.error('[CloudSync] Lỗi pullAllFromCloud:', e);
        this.updateUIStatus('error', 'Lỗi tải dữ liệu');
        this.isSyncing = false;
        return false;
      }
    }
  };

  // Expose ra window toàn cục
  window.MrsFirebase = MrsFirebase;

})(window);
