import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, loginWithOtp } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import Form from '@/components/common/Form';
import clsx from 'clsx';

/* ── 포맷 / 검증 ── */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

const NAME_REGEX = /^[가-힣a-zA-Z\s]{2,}$/;
const PHONE_REGEX = /^01[016789]\d{7,8}$/;
const OTP_DURATION = 180;

function getNameError(name: string) {
  if (!name.trim()) return '이름을 입력해주세요.';
  if (!NAME_REGEX.test(name.trim()))
    return '이름은 한글 또는 영문 2자 이상 입력해주세요.';
  return '';
}
function getPhoneError(phone: string) {
  const d = phone.replace(/\D/g, '');
  if (!d) return '전화번호를 입력해주세요.';
  if (!PHONE_REGEX.test(d))
    return '올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)';
  return '';
}

/* ── OTP 6자리 입력 박스 ── */
function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleInput(i: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    const next = Array(6).fill('');
    pasted.split('').forEach((ch, idx) => {
      next[idx] = ch;
    });
    onChange(next);
    const focusIdx = Math.min(pasted.length, 5);
    refs.current[focusIdx]?.focus();
  }

  return (
    <div className='flex gap-2 justify-between'>
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type='text'
          inputMode='numeric'
          maxLength={1}
          disabled={disabled}
          value={value[i]}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={clsx(
            'w-full aspect-square text-center text-[20px] font-bold rounded-[var(--radius-card)] border outline-none transition-all',
            'disabled:bg-bg-secondary disabled:text-text-dim',
            value[i]
              ? 'border-[#00854A] text-[#00854A] bg-[rgba(0,133,74,0.05)]'
              : 'border-border text-text-heading bg-white focus:border-[#171717] focus:shadow-[0_0_0_3px_rgba(23,23,23,0.08)]'
          )}
        />
      ))}
    </div>
  );
}

/* ── 타이머 훅 ── */
function useCountdown(active: boolean, resetKey: number) {
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);

  useEffect(() => {
    setTimeLeft(OTP_DURATION);
  }, [resetKey]);

  useEffect(() => {
    if (!active || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [active, timeLeft]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  return { timeLeft, label: `${mins}:${secs}` };
}

/* ── LoginPage ── */
export default function LoginPage() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');

  const { timeLeft, label: timerLabel } = useCountdown(otpSent, resetKey);
  const isExpired = otpSent && timeLeft <= 0;

  const nameError = getNameError(name);
  const phoneError = getPhoneError(phone);
  const phoneDigits = phone.replace(/\D/g, '');
  const formValid =
    NAME_REGEX.test(name.trim()) && PHONE_REGEX.test(phoneDigits);
  const otpFilled = otpDigits.every((d) => d !== '') && !isExpired;

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSendOtp() {
    if (!formValid) return;
    setIsLoading(true);
    try {
      await sendOtp({ phone: phoneDigits });
      setOtpDigits(Array(6).fill(''));
      setOtpError('');
      setOtpSent(true);
      setResetKey((k) => k + 1);
    } catch {
      setOtpError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    setIsLoading(true);
    try {
      await sendOtp({ phone: phoneDigits });
      setOtpDigits(Array(6).fill(''));
      setOtpError('');
      setResetKey((k) => k + 1);
    } catch {
      setOtpError('재발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setOtpSent(false);
    setOtpDigits(Array(6).fill(''));
    setOtpError('');
  }

  async function handleVerify() {
    if (!otpFilled) return;
    setIsLoading(true);
    try {
      const res = await loginWithOtp({
        phone: phoneDigits,
        otp_code: otpDigits.join(''),
      });
      // MSW 환경: Set-Cookie가 동작하지 않으므로 응답 토큰으로 쿠키 수동 설정
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        document.cookie = `access_token=${res.access_token}; path=/; SameSite=Strict`;
      }
      setUser(res.user);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      // 미가입 사용자 → 회원가입 페이지로 이동
      if (err instanceof Error && err.message.includes('USER_NOT_FOUND')) {
        navigate('/signup', {
          state: { name: name.trim(), phone: phoneDigits },
        });
        return;
      }
      const msg = err instanceof Error ? err.message : '인증에 실패했습니다.';
      setOtpError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='min-h-dvh flex flex-col bg-bg max-w-[430px] mx-auto'>
      {/* 브랜드 헤더 */}
      <div className='px-[var(--space-page)] pt-16 pb-10'>
        <div
          className='w-12 h-12 rounded-[14px] flex items-center justify-center mb-6'
          style={{
            background: 'linear-gradient(135deg, #00854A 0%, #009559 100%)',
          }}
        >
          <svg
            width='22'
            height='22'
            viewBox='0 0 24 24'
            fill='none'
            stroke='white'
            strokeWidth='2.2'
          >
            <path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' />
            <polyline points='9 22 9 12 15 12 15 22' />
          </svg>
        </div>
        <h1 className='text-[28px] font-bold text-text-heading tracking-[-0.03em] leading-tight mb-2'>
          입주민 보험 서비스
        </h1>
        <p className='text-[14px] text-text-muted leading-relaxed'>
          이름과 전화번호로 간편하게
          <br />
          시작하세요
        </p>
      </div>

      <div className='flex-1 px-[var(--space-page)]'>
        <Form onSubmit={otpSent ? handleVerify : handleSendOtp}>
          {/* 이름 */}
          <Form.Field>
            <Form.Label>이름</Form.Label>
            <Form.Input
              type='text'
              placeholder='홍길동'
              value={name}
              autoComplete='name'
              disabled={otpSent}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur('name')}
              className={otpSent ? '!bg-bg-secondary !text-text-muted' : ''}
            />
            {touched.name && nameError && !otpSent && (
              <Form.Error>{nameError}</Form.Error>
            )}
          </Form.Field>

          {/* 전화번호 + 변경 버튼 */}
          <Form.Field>
            <Form.Label>전화번호</Form.Label>
            <div className='flex gap-2'>
              <Form.Input
                type='tel'
                placeholder='010-0000-0000'
                value={phone}
                autoComplete='tel'
                disabled={otpSent}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                onBlur={() => handleBlur('phone')}
                maxLength={13}
                className={clsx(
                  'flex-1',
                  otpSent && '!bg-bg-secondary !text-text-muted'
                )}
              />
              {otpSent && (
                <button
                  type='button'
                  onClick={handleReset}
                  className='btn btn-outline shrink-0 !px-3 !text-[13px]'
                >
                  변경
                </button>
              )}
            </div>
            {touched.phone && phoneError && !otpSent && (
              <Form.Error>{phoneError}</Form.Error>
            )}
          </Form.Field>

          {/* 인증번호 발송 전: 버튼 */}
          {!otpSent && (
            <button
              type='submit'
              disabled={!formValid || isLoading}
              className={clsx(
                'btn btn-accent btn-full mt-2',
                (!formValid || isLoading) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? '발송 중...' : '인증번호 받기'}
            </button>
          )}

          {/* 인증번호 입력 섹션 */}
          {otpSent && (
            <div>
              <div className='mb-4 p-3.5 rounded-[var(--radius-card)] bg-[rgba(0,133,74,0.06)] border border-[rgba(0,133,74,0.2)] flex items-start gap-2.5'>
                <svg
                  className='shrink-0 mt-0.5'
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#00854A'
                  strokeWidth='2'
                >
                  <circle cx='12' cy='12' r='10' />
                  <path d='M12 8v4M12 16h.01' strokeLinecap='round' />
                </svg>
                <p className='text-[13px] text-[#00593a] font-medium'>
                  {phone}으로 인증번호가 발송되었습니다.
                </p>
              </div>

              <Form.Field>
                <div className='flex items-center justify-between mb-2'>
                  <Form.Label className='!mb-0'>인증번호 6자리</Form.Label>
                  <span
                    className={clsx(
                      'text-[13px] font-semibold tabular-nums',
                      isExpired
                        ? 'text-danger'
                        : timeLeft <= 60
                        ? 'text-[#f59e0b]'
                        : 'text-[#0061AF]'
                    )}
                  >
                    {isExpired ? '시간 초과' : timerLabel}
                  </span>
                </div>
                <OtpInput
                  value={otpDigits}
                  onChange={(next) => {
                    setOtpDigits(next);
                    setOtpError('');
                  }}
                  disabled={isExpired}
                />
                {isExpired && (
                  <Form.Error>
                    인증 시간이 만료되었습니다. 재발송 버튼을 눌러주세요.
                  </Form.Error>
                )}
                {otpError && <Form.Error>{otpError}</Form.Error>}
              </Form.Field>

              <div className='flex justify-end mb-4'>
                <button
                  type='button'
                  onClick={handleResend}
                  disabled={isLoading}
                  className='text-[13px] text-text-muted underline'
                >
                  인증번호 재발송
                </button>
              </div>

              <button
                type='submit'
                disabled={!otpFilled || isLoading}
                className={clsx(
                  'btn btn-accent btn-full',
                  (!otpFilled || isLoading) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isLoading ? '확인 중...' : '확인'}
              </button>
            </div>
          )}
        </Form>

        {!otpSent && (
          <div className='mt-6 p-4 rounded-[var(--radius-card)] bg-bg-secondary'>
            <p className='text-[12px] text-text-muted leading-relaxed'>
              <span className='font-semibold text-text-body'>
                처음 방문하신 경우
              </span>
              에는 회원가입 페이지로 이동합니다. 이미 등록된 경우 바로 홈
              화면으로 이동합니다.
            </p>
          </div>
        )}
      </div>

      <div className='px-[var(--space-page)] pb-12 pt-6'>
        <p className='text-[11px] text-text-dim text-center'>
          DB손해보험 입주민 전용 서비스
        </p>
      </div>
    </div>
  );
}
