import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';
import { Share } from '@capacitor/share';

interface PluginResult {
  label: string;
  data: string;
  error?: boolean;
}

export default function NativePage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<PluginResult[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);

  function addResult(result: PluginResult) {
    setResults((prev) => [result, ...prev]);
  }

  async function handleCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });
      setPhoto(image.dataUrl ?? null);
      addResult({ label: '📷 카메라', data: `포맷: ${image.format}` });
    } catch (e) {
      addResult({ label: '📷 카메라', data: String(e), error: true });
    }
  }

  async function handleGeolocation() {
    try {
      const pos = await Geolocation.getCurrentPosition();
      const { latitude, longitude, accuracy } = pos.coords;
      addResult({
        label: '📍 위치',
        data: `위도: ${latitude.toFixed(6)}, 경도: ${longitude.toFixed(6)}, 정확도: ${accuracy?.toFixed(0)}m`,
      });
    } catch (e) {
      addResult({ label: '📍 위치', data: String(e), error: true });
    }
  }

  async function handleHaptics() {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
      addResult({ label: '📳 진동', data: '진동 피드백 실행 (네이티브에서만 체감)' });
    } catch (e) {
      addResult({ label: '📳 진동', data: String(e), error: true });
    }
  }

  async function handleDevice() {
    try {
      const info = await Device.getInfo();
      const battery = await Device.getBatteryInfo();
      addResult({
        label: '📱 기기 정보',
        data: `${info.manufacturer ?? ''} ${info.model} · ${info.operatingSystem} ${info.osVersion} · 배터리 ${battery.batteryLevel ? Math.round(battery.batteryLevel * 100) + '%' : '알 수 없음'}`,
      });
    } catch (e) {
      addResult({ label: '📱 기기 정보', data: String(e), error: true });
    }
  }

  async function handleShare() {
    try {
      await Share.share({
        title: 'Mobile Capacitor',
        text: 'Capacitor 네이티브 플러그인 체험 중!',
        url: 'https://capacitorjs.com',
      });
      addResult({ label: '🔗 공유', data: '공유 시트 열림' });
    } catch (e) {
      addResult({ label: '🔗 공유', data: String(e), error: true });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          ← 뒤로
        </button>
        <h1 className="text-lg font-bold text-gray-900">네이티브 플러그인</h1>
      </header>

      <main className="p-4 space-y-4">
        {/* 플러그인 버튼 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          <PluginButton label="📷 카메라" sub="사진 촬영/선택" onClick={handleCamera} />
          <PluginButton label="📍 위치" sub="현재 좌표 조회" onClick={handleGeolocation} />
          <PluginButton label="📳 진동" sub="햅틱 피드백" onClick={handleHaptics} />
          <PluginButton label="📱 기기 정보" sub="모델/OS/배터리" onClick={handleDevice} />
          <PluginButton label="🔗 공유" sub="공유 시트 열기" onClick={handleShare} />
        </div>

        {/* 촬영 사진 미리보기 */}
        {photo && (
          <div className="bg-white rounded-2xl border border-gray-200 p-3">
            <img src={photo} alt="촬영 사진" className="w-full rounded-xl" />
          </div>
        )}

        {/* 결과 로그 */}
        {results.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500">실행 결과</h2>
            {results.map((r, i) => (
              <div
                key={i}
                className={`rounded-xl border p-3 text-sm ${
                  r.error
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                <span className="font-medium">{r.label}</span>
                <p className="mt-0.5 text-xs break-all">{r.data}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PluginButton({ label, sub, onClick }: { label: string; sub: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <div className="text-sm font-medium text-gray-900">{label}</div>
      <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
    </button>
  );
}
