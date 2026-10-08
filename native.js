// ReViva — camada nativa (só age dentro do app iOS/Android via Capacitor).
// No navegador, isNative = false e nada aqui muda o comportamento do PWA.
(function () {
  var Cap = window.Capacitor;
  var isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  var P = {};
  if (isNative) {
    ['Preferences', 'LocalNotifications', 'Haptics'].forEach(function (n) {
      try { P[n] = (Cap.Plugins && Cap.Plugins[n]) || (Cap.registerPlugin && Cap.registerPlugin(n)); } catch (e) {}
    });
  }
  var PREFIX = 'reviva';

  // 1) Armazenamento durável: espelha o localStorage do app no armazenamento nativo
  //    (o iOS pode limpar o armazenamento do WebView; o nativo não).
  if (isNative && P.Preferences) {
    var origSet = Storage.prototype.setItem, origRemove = Storage.prototype.removeItem;
    Storage.prototype.setItem = function (k, v) {
      origSet.apply(this, arguments);
      if (this === window.localStorage && String(k).indexOf(PREFIX) === 0) P.Preferences.set({ key: k, value: String(v) }).catch(function () {});
    };
    Storage.prototype.removeItem = function (k) {
      origRemove.apply(this, arguments);
      if (this === window.localStorage && String(k).indexOf(PREFIX) === 0) P.Preferences.remove({ key: k }).catch(function () {});
    };
    // Restaura se o WebView perdeu os dados (recarrega uma única vez).
    try {
      if (!localStorage.getItem('reviva:v2') && !sessionStorage.getItem('reviva:restored')) {
        P.Preferences.get({ key: 'reviva:v2' }).then(function (r) {
          if (r && r.value) { origSet.call(localStorage, 'reviva:v2', r.value); sessionStorage.setItem('reviva:restored', '1'); location.reload(); }
        }).catch(function () {});
      }
    } catch (e) {}
  }

  // 2) Lembretes gentis (notificações locais, sem servidor).
  var MSGS = [
    'Seu jardim está aqui, no seu tempo. Que tal um minuto de cuidado?',
    'Como você está hoje? Um check-in leve pode ajudar.',
    'Respire. Você não precisa dar conta de tudo hoje.',
    'Uma palavra para quem você ama: o Elo te espera quando quiser.',
    'Dias difíceis também fazem parte. Estamos aqui.',
    'Um pequeno passo já é cuidado. Sem pressa.',
    'Seu jardim cresce no seu ritmo. Passe para ver?'
  ];
  var reminders = {
    available: isNative && !!P.LocalNotifications,
    enable: function (hour) {
      var LN = P.LocalNotifications;
      if (!this.available) return Promise.resolve(false);
      return LN.requestPermissions().then(function (perm) {
        if (!perm || perm.display !== 'granted') return false;
        return reminders.disable().then(function () {
          var list = MSGS.map(function (body, i) {
            return { id: 7100 + i, title: 'ReViva', body: body, schedule: { on: { weekday: i + 1, hour: hour, minute: 0 }, allowWhileIdle: true } };
          });
          return LN.schedule({ notifications: list }).then(function () { return true; });
        });
      }).catch(function () { return false; });
    },
    disable: function () {
      if (!this.available) return Promise.resolve();
      var ids = MSGS.map(function (_, i) { return { id: 7100 + i }; });
      return P.LocalNotifications.cancel({ notifications: ids }).catch(function () {});
    }
  };

  // 3) Toque sutil ao concluir passos.
  function haptic() { if (!isNative || !P.Haptics) return; try { var r = P.Haptics.impact({ style: 'LIGHT' }); if (r && r.catch) r.catch(function () {}); } catch (e) {} }

  window.RevivaNative = { isNative: isNative, reminders: reminders, haptic: haptic, platform: isNative ? Cap.getPlatform() : 'web' };
})();
