'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import TopBar, { type TimeView } from '@/components/chart/TopBar';
import ChartBoard from '@/components/chart/ChartBoard';
import InsightPanel, { type FocusState } from '@/components/insight/InsightPanel';
import PatternsCard from '@/components/PatternsCard';
import FamousPersonCard from '@/components/FamousPersonCard';
import ShareModal from '@/components/ShareModal';
import { FAMOUS_PERSONS } from '@/lib/ziwei/famous';
import type { BirthInfo, ZiweiChart, Star, Palace } from '@/lib/ziwei/types';
import { formToSearchParams, searchParamsToForm, formToBirthInfo } from '@/lib/ziwei/share';
import { useHistory } from '@/lib/ziwei/history';

export default function ChartPage() {
  const router = useRouter();

  // ── 命盘状态 ──────────────────────────────────────────────
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedForm, setSavedForm] = useState<BirthFormState | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // ── 时间视图状态 ──────────────────────────────────────────
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(new Date().getFullYear());
  const [liuyueMonth, setLiuyueMonth] = useState(new Date().getMonth() + 1);

  // ── 聚焦状态（宫位/星曜/四化）────────────────────────────
  const [focus, setFocus] = useState<FocusState | null>(null);

  const { history, save: saveHistory, remove: removeHistory } = useHistory();

  // ── URL 参数自动起盘 ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const formData = searchParamsToForm(params);
    if (!formData?.year) return;
    const fullForm: BirthFormState = {
      name: '', year: '', month: '', day: '',
      clockHour: '8', clockMinute: '0', unknownTime: false,
      province: '', city: '', longitude: 120, gender: 'male',
      ...formData,
    };
    setSavedForm(fullForm);
    handleSubmit(formToBirthInfo(fullForm));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 起盘 ──────────────────────────────────────────────────
  const handleSubmit = async (info: BirthInfo) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? '命盘生成失败');
      }
      const data: ZiweiChart = await res.json();
      setChart(data);
      setFocus(null);
      setView('mingpan');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // ── 重置 ──────────────────────────────────────────────────
  const handleReset = () => {
    setChart(null);
    setError('');
    setFocus(null);
    setSavedForm(null);
    setFormKey(k => k + 1);
    setView('mingpan');
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/chart');
    }
  };

  // ── 分享：暂关闭（隐私问题：分享卡含出生日期+城市，等于暴露身份信息）──
  // 后续要做需先解决：① 出生信息脱敏（只保留命宫主星等不可逆信息）
  //                  ② 用户主动选择分享多少信息
  //                  ③ 链接生成短码避免 URL 暴露
  const handleShare = () => {
    alert('分享功能正在完善中（隐私脱敏方案）— 公测版本将正式开放');
  };

  // 计算分享 URL（OG 卡片图改为前端 Canvas 渲染，不再走 SSR）
  const shareUrl = savedForm
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/chart?${formToSearchParams(savedForm).toString()}`
    : '';

  const handleLoadHistory = (form: BirthFormState) => {
    setSavedForm(form);
    const params = formToSearchParams(form);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', `/chart?${params.toString()}`);
    }
    handleSubmit(formToBirthInfo(form));
  };

  // ── 命盘交互回调 ──────────────────────────────────────────
  const handleStarClick = (star: Star, palace: Palace) => {
    setFocus({ type: 'star', label: `${star.name} · ${palace.name}`, star, palace });
  };

  const handlePalaceClick = (palace: Palace) => {
    setFocus({ type: 'palace', label: palace.name, palace });
  };

  const handleSiHuaBadgeClick = (starName: string, siHua: string) => {
    setFocus({ type: 'sihua', label: `${starName} 化${siHua}`, siHua });
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>
      {!chart ? (

        /* ═══════════════════════════════════════════════════
           表单视图
        ═══════════════════════════════════════════════════ */
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* 简洁顶栏 */}
          <header style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: 'color-mix(in srgb, var(--bg-0) 92%, transparent)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--bdr)',
            display: 'flex', alignItems: 'center',
            padding: '0 24px', height: '52px',
            gap: '16px',
          }}>
            <button
              onClick={() => router.push('/')}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '13px', color: 'var(--tx-3)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 0',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--tx-1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--tx-3)'; }}
            >
              <span style={{ fontSize: '16px' }}>‹</span>
              <span>返回</span>
            </button>
            <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
            <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em' }}>紫微命盘</span>
          </header>

          {/* 表单内容 */}
          <div style={{ maxWidth: '440px', margin: '0 auto', padding: '48px 24px 80px', flex: 1, width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '36px', color: 'var(--ac)', opacity: 0.12, marginBottom: '14px', lineHeight: 1 }}>
                ☯
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '0.2em', color: 'var(--tx-0)', marginBottom: '8px' }}>
                起紫微命盘
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.05em' }}>
                输入出生年月日时 · 以公历为准
              </p>
            </div>

            <BirthForm
              key={formKey}
              onSubmit={handleSubmit}
              loading={loading}
              initialData={savedForm ?? undefined}
              onFormSave={form => {
                setSavedForm(form);
                // 只在关键字段齐全时才同步 URL + 历史；否则 BirthForm mount 时的空值会覆盖现有合法 URL
                if (form.year && form.month && form.day) {
                  saveHistory(form);
                  const params = formToSearchParams(form);
                  if (typeof window !== 'undefined') {
                    window.history.replaceState({}, '', `/chart?${params.toString()}`);
                  }
                }
              }}
            />

            {error && (
              <div style={{
                marginTop: '12px', padding: '12px 16px',
                background: 'rgba(168,50,40,0.06)',
                border: '1px solid rgba(168,50,40,0.2)',
                borderRadius: 'var(--r-md)',
                fontSize: '12px', color: 'var(--ji)',
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            {/* 历史命盘 */}
            {history.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'var(--tx-3)' }}>历史命盘</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--bdr)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {history.map(entry => (
                    <div
                      key={entry.id}
                      onClick={() => handleLoadHistory(entry.form)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 14px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--bdr)',
                        borderRadius: 'var(--r-md)',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ac-bdr)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bdr)'; }}
                    >
                      <span style={{ fontSize: '11px', color: 'var(--ac)', opacity: 0.5, flexShrink: 0 }}>☯</span>
                      <span style={{
                        fontSize: '12px', flex: 1,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        color: 'var(--tx-2)',
                      }}>
                        {entry.label}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); removeHistory(entry.id); }}
                        style={{
                          fontSize: '16px', color: 'var(--tx-3)',
                          background: 'none', border: 'none',
                          cursor: 'pointer', lineHeight: 1, opacity: 0.5,
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.5'; }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      ) : (

        /* ═══════════════════════════════════════════════════
           命盘视图 — 桌面双栏 / 手机单栏
        ═══════════════════════════════════════════════════ */
        <div className="chart-page-root">

          {/* 顶部时间导航栏 */}
          <TopBar
            chart={chart}
            view={view}
            liunianYear={liunianYear}
            liuyueMonth={liuyueMonth}
            onViewChange={setView}
            onYearChange={setLiunianYear}
            onMonthChange={setLiuyueMonth}
            onShare={savedForm ? handleShare : undefined}
            onExport={() => window.print()}
            copied={copied}
          />

          {/* 主体：桌面双栏 / 手机上下堆叠 */}
          <div className="chart-workspace">

            {/* 左栏：命盘主舞台 */}
            <div className="chart-workspace-left">
              <ChartBoard
                chart={chart}
                view={view}
                liunianYear={liunianYear}
                onStarClick={handleStarClick}
                onPalaceClick={handlePalaceClick}
                onSiHuaBadgeClick={handleSiHuaBadgeClick}
                onTimeViewChange={setView}
              />

              {/* 底部操作区 */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button
                  onClick={handleReset}
                  style={{
                    fontSize: '11px', color: 'var(--tx-3)',
                    background: 'none', border: '1px solid var(--bdr)',
                    borderRadius: 'var(--r-pill)', padding: '5px 16px',
                    cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = 'var(--tx-1)';
                    el.style.borderColor = 'var(--bdr-med)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = 'var(--tx-3)';
                    el.style.borderColor = 'var(--bdr)';
                  }}
                >
                  重新起盘
                </button>
              </div>
            </div>

            {/* 右栏：洞察工作区 */}
            <div className="chart-workspace-right">
              {(() => {
                const famous = FAMOUS_PERSONS.find(p =>
                  p.name === chart.birthInfo.name &&
                  p.year === chart.birthInfo.year &&
                  p.month === chart.birthInfo.month &&
                  p.day === chart.birthInfo.day,
                );
                return famous ? <FamousPersonCard person={famous} /> : null;
              })()}
              <PatternsCard chart={chart} />
              <InsightPanel
                chart={chart}
                view={view}
                liunianYear={liunianYear}
                liuyueMonth={liuyueMonth}
                focus={focus}
                onClearFocus={() => setFocus(null)}
              />
            </div>

          </div>
        </div>
      )}

      {/* 分享弹窗（含卡片图 + 下载 + 复制链接）*/}
      {savedForm && (
        <ShareModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          shareUrl={shareUrl}
          chart={chart}
          birth={{
            year: savedForm.year,
            month: savedForm.month,
            day: savedForm.day,
            hour: savedForm.clockHour,
            minute: savedForm.clockMinute,
            gender: savedForm.gender,
            city: savedForm.city || undefined,
          }}
        />
      )}
    </div>
  );
}
