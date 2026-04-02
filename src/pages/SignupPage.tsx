import { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { register } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import Form from '@/components/common/Form';
import StepIndicator from '@/components/common/StepIndicator';
import Modal from '@/components/common/Modal';
import clsx from 'clsx';

interface LocationState {
  name: string;
  phone: string;
}

function formatPhoneDisplay(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/* ── Validation helpers ── */
const APT_REGEX = /^[가-힣a-zA-Z0-9\s]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getAptError(v: string) {
  if (!v.trim()) return '아파트 단지명을 입력해주세요.';
  if (!APT_REGEX.test(v.trim())) return '올바른 아파트 단지명을 입력해주세요.';
  return '';
}
function getDongError(v: string) {
  const n = Number(v);
  if (!v) return '동을 입력해주세요.';
  if (!Number.isInteger(n) || n < 1 || n > 999)
    return '올바른 동을 입력해주세요.';
  return '';
}
function getHoError(v: string) {
  const n = Number(v);
  if (!v) return '호수를 입력해주세요.';
  if (!Number.isInteger(n) || n < 1 || n > 9999)
    return '올바른 호수를 입력해주세요.';
  return '';
}
function getEmailError(v: string) {
  if (!v.trim()) return '이메일을 입력해주세요.';
  if (!EMAIL_REGEX.test(v)) return '올바른 이메일 주소를 입력해주세요.';
  return '';
}

/* ── Checkbox Row ── */
function CheckRow({
  checked,
  onChange,
  label,
  required,
  onView,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  required?: boolean;
  onView?: () => void;
}) {
  return (
    <div className='border border-border rounded-[var(--radius-card)] overflow-hidden'>
      <div className='flex items-center gap-3 px-4 py-3'>
        <button
          type='button'
          onClick={() => onChange(!checked)}
          className={clsx(
            'w-5 h-5 rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all',
            checked ? 'bg-[#00854A] border-[#00854A]' : 'bg-white border-border'
          )}
        >
          {checked && (
            <svg width='11' height='9' viewBox='0 0 11 9' fill='none'>
              <path
                d='M1 4l3 3 6-6'
                stroke='white'
                strokeWidth='1.8'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </button>
        <span className='flex-1 text-[14px] text-text-body'>
          {required && (
            <span className='text-[#C9252C] mr-1 font-semibold'>[필수]</span>
          )}
          {label}
        </span>
        {onView && (
          <button
            type='button'
            onClick={onView}
            className='text-[11px] text-text-dim underline shrink-0'
          >
            보기
          </button>
        )}
      </div>
    </div>
  );
}

const PRIVACY_CONTENT = `수집 항목
이름, 전화번호, 이메일, 주소, 신분증 사진

수집 목적
입주민 인증 및 보험 접수 서비스 제공

보유 기간
서비스 탈퇴 시까지 (최대 5년)

제3자 제공
보험금 심사를 위해 DB손해보험(주)에 제공될 수 있으며, 법령에 따른 경우를 제외하고 별도 동의 없이 제3자에게 제공하지 않습니다.

위의 개인정보 수집·이용에 동의하십니까?`;

const TERMS_CONTENT = `제1조 (목적)
이 약관은 DB손해보험 입주민 앱 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 회원 간의 권리·의무를 규정함을 목적으로 합니다.

제2조 (서비스 이용)
본 서비스는 아파트 입주민의 피해 접수 및 보험금 청구를 지원합니다. 서비스 이용을 위해 회원가입이 필요하며, 허위 정보 제공 시 이용이 제한될 수 있습니다.

제3조 (면책)
서비스 내 AI 분석 결과는 참고용이며, 최종 보상금액은 심사 결과에 따라 달라질 수 있습니다. 회사는 AI 분석 결과의 정확성에 대해 법적 책임을 지지 않습니다.

제4조 (이용 제한)
부정한 방법으로 서비스를 이용하거나 타인의 정보를 도용한 경우, 회사는 사전 통지 없이 서비스 이용을 제한할 수 있습니다.

제5조 (준거법)
이 약관은 대한민국 법률에 따라 해석 및 적용됩니다.`;

/* ── Step 1 ── */
function Step1({
  name,
  phone,
  onNext,
}: {
  name: string;
  phone: string;
  onNext: (data: {
    apt: string;
    dong: string;
    ho: string;
    email: string;
  }) => void;
}) {
  const [apt, setApt] = useState('');
  const [dong, setDong] = useState('');
  const [ho, setHo] = useState('');
  const [email, setEmail] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [termModal, setTermModal] = useState<{
    open: boolean;
    title: string;
    content: string;
  }>({
    open: false,
    title: '',
    content: '',
  });

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const aptError = getAptError(apt);
  const dongError = getDongError(dong);
  const hoError = getHoError(ho);
  const emailError = getEmailError(email);

  const isValid =
    !aptError &&
    !dongError &&
    !hoError &&
    !emailError &&
    agreePrivacy &&
    agreeTerms;

  function handleNext() {
    if (isValid) onNext({ apt, dong, ho, email });
  }

  return (
    <div className='flex-1 px-[var(--space-page)] pb-10 overflow-y-auto'>
      {/* 로그인 정보 (읽기 전용) */}
      <div className='mb-5 p-4 rounded-[var(--radius-card)] bg-bg-secondary border border-border'>
        <p className='text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-2.5'>
          로그인 정보
        </p>
        <div className='grid grid-cols-2 gap-x-4 gap-y-1.5'>
          <div>
            <span className='text-[11px] text-text-dim'>이름</span>
            <p className='text-[14px] font-semibold text-text-heading'>
              {name}
            </p>
          </div>
          <div>
            <span className='text-[11px] text-text-dim'>전화번호</span>
            <p className='text-[14px] font-semibold text-text-heading'>
              {formatPhoneDisplay(phone)}
            </p>
          </div>
        </div>
      </div>

      <Form onSubmit={handleNext}>
        <Form.Field>
          <Form.Label>아파트 단지명</Form.Label>
          <Form.Input
            type='text'
            placeholder='예) 더블유'
            value={apt}
            onChange={(e) => setApt(e.target.value)}
            onBlur={() => handleBlur('apt')}
          />
          {touched.apt && aptError && <Form.Error>{aptError}</Form.Error>}
        </Form.Field>

        <div className='grid grid-cols-2 gap-3'>
          <Form.Field className='!mb-0'>
            <Form.Label>동</Form.Label>
            <Form.Input
              type='number'
              placeholder='101'
              min={1}
              max={999}
              value={dong}
              onChange={(e) => setDong(e.target.value)}
              onBlur={() => handleBlur('dong')}
            />
            {touched.dong && dongError && <Form.Error>{dongError}</Form.Error>}
          </Form.Field>
          <Form.Field className='!mb-0'>
            <Form.Label>호수</Form.Label>
            <Form.Input
              type='number'
              placeholder='1502'
              min={1}
              max={9999}
              value={ho}
              onChange={(e) => setHo(e.target.value)}
              onBlur={() => handleBlur('ho')}
            />
            {touched.ho && hoError && <Form.Error>{hoError}</Form.Error>}
          </Form.Field>
        </div>
        <div className='mb-5' />

        <Form.Field>
          <Form.Label>이메일</Form.Label>
          <Form.Input
            type='email'
            placeholder='example@email.com'
            value={email}
            autoComplete='email'
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
          />
          {touched.email && emailError && <Form.Error>{emailError}</Form.Error>}
        </Form.Field>

        {/* 동의 체크박스 */}
        <p className='text-[12px] font-semibold text-text-dim uppercase tracking-wider mb-3'>
          약관 동의
        </p>
        <div className='flex flex-col gap-2.5 mb-6'>
          <CheckRow
            checked={agreePrivacy}
            onChange={setAgreePrivacy}
            label='개인정보 처리방침 동의'
            required
            onView={() =>
              setTermModal({
                open: true,
                title: '개인정보 처리방침',
                content: PRIVACY_CONTENT,
              })
            }
          />
          <CheckRow
            checked={agreeTerms}
            onChange={setAgreeTerms}
            label='이용약관 동의'
            required
            onView={() =>
              setTermModal({
                open: true,
                title: '이용약관',
                content: TERMS_CONTENT,
              })
            }
          />
        </div>

        <button
          type='submit'
          disabled={!isValid}
          className={clsx(
            'btn btn-accent btn-full',
            !isValid && 'opacity-50 cursor-not-allowed'
          )}
        >
          다음 단계
        </button>
      </Form>

      {/* 약관 모달 */}
      <Modal
        open={termModal.open}
        onClose={() => setTermModal((p) => ({ ...p, open: false }))}
      >
        <Modal.Header>
          <h2 className='text-[17px] font-bold text-text-heading'>
            {termModal.title}
          </h2>
        </Modal.Header>
        <Modal.Body>
          <p className='text-[13px] text-text-muted leading-relaxed whitespace-pre-line'>
            {termModal.content}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            className='btn btn-accent btn-full'
            onClick={() => setTermModal((p) => ({ ...p, open: false }))}
          >
            확인
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

/* ── Step 2 ── */
function Step2({
  onSubmit,
  isLoading,
}: {
  onSubmit: (file: File) => void;
  isLoading?: boolean;
}) {
  const [idCard, setIdCard] = useState<string | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdCardFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setIdCard(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className='flex-1 px-[var(--space-page)] pb-10'>
      <div className='mb-5 p-4 rounded-[var(--radius-card)] bg-[rgba(0,133,74,0.06)] border border-[rgba(0,133,74,0.2)]'>
        <div className='flex gap-2.5'>
          <svg
            className='shrink-0 mt-0.5'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#00854A'
            strokeWidth='2'
          >
            <circle cx='12' cy='12' r='10' />
            <path d='M12 8v4M12 16h.01' strokeLinecap='round' />
          </svg>
          <p className='text-[13px] text-[#00593a] leading-relaxed'>
            신분증은 입주민 인증에만 사용되며, 안전하게 암호화되어 보관됩니다.
            주민등록증 또는 운전면허증을 촬영해 주세요.
          </p>
        </div>
      </div>

      <div
        className={clsx(
          'w-full aspect-[3/2] rounded-[var(--radius-xl)] border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all relative overflow-hidden',
          idCard
            ? 'border-[#00854A] border-solid'
            : 'border-border hover:border-text-muted'
        )}
        onClick={() => inputRef2.current?.click()}
      >
        <input
          ref={inputRef2}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleChange}
        />
        {idCard ? (
          <>
            <img
              src={idCard}
              alt='신분증 미리보기'
              className='absolute inset-0 w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2'>
              <div className='w-8 h-8 rounded-full bg-white/90 flex items-center justify-center'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#00854A'
                  strokeWidth='2.5'
                >
                  <path d='M20 6L9 17l-5-5' />
                </svg>
              </div>
              <span className='text-white text-[13px] font-semibold'>
                업로드 완료 · 탭하여 변경
              </span>
            </div>
          </>
        ) : (
          <>
            <div className='w-14 h-14 rounded-[14px] bg-bg-secondary flex items-center justify-center'>
              <svg
                width='28'
                height='28'
                viewBox='0 0 24 24'
                fill='none'
                stroke='var(--color-text-dim)'
                strokeWidth='1.5'
              >
                <rect x='2' y='5' width='20' height='14' rx='2' />
                <circle cx='8' cy='11' r='2' />
                <path d='M14 10h4M14 13h3' strokeLinecap='round' />
              </svg>
            </div>
            <div className='text-center'>
              <p className='text-[14px] font-semibold text-text-body'>
                신분증 사진 업로드
              </p>
              <p className='text-[12px] text-text-muted mt-1'>
                주민등록증 또는 운전면허증
              </p>
            </div>
            <span className='text-[11px] text-text-dim'>탭하여 사진 선택</span>
          </>
        )}
      </div>

      <div className='mt-4 flex gap-2 text-[12px] text-text-dim'>
        <span>✓</span>
        <span>사진이 선명하게 찍혀야 합니다</span>
      </div>
      <div className='mt-1.5 flex gap-2 text-[12px] text-text-dim'>
        <span>✓</span>
        <span>신분증 전체가 화면에 나와야 합니다</span>
      </div>
      <div className='mt-1.5 flex gap-2 text-[12px] text-text-dim'>
        <span>✓</span>
        <span>빛 반사가 없는 환경에서 촬영해 주세요</span>
      </div>

      <button
        type='button'
        disabled={!idCardFile || isLoading}
        className={clsx(
          'btn btn-full mt-6',
          idCardFile && !isLoading
            ? 'btn-accent'
            : 'btn-secondary opacity-50 cursor-not-allowed'
        )}
        onClick={() => idCardFile && onSubmit(idCardFile)}
      >
        {isLoading ? '처리 중...' : '회원가입 완료'}
      </button>
    </div>
  );
}

/* ── SignupPage ── */
export default function SignupPage() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const name = state?.name ?? '';
  const phone = state?.phone ?? '';

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<{
    apt: string;
    dong: string;
    ho: string;
    email: string;
  } | null>(null);

  function handleStep1Next(data: typeof step1Data) {
    setStep1Data(data);
    setStep(2);
  }

  async function handleSubmit(idCardFile: File) {
    if (!step1Data) return;
    setIsLoading(true);
    try {
      const res = await register({
        name,
        phone,
        email: step1Data.email,
        apartment_name: step1Data.apt,
        unit_dong: step1Data.dong,
        unit_ho: step1Data.ho,
        id_card_photo: idCardFile,
      });
      // MSW 환경: Set-Cookie가 동작하지 않으므로 수동 설정
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        document.cookie = `access_token=${res.access_token}; path=/; SameSite=Strict`;
      }
      setUser(res.user);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      console.error('회원가입 오류:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='min-h-dvh flex flex-col bg-bg max-w-[430px] mx-auto'>
      {/* 헤더 */}
      <div className='px-[var(--space-page)] pt-12 pb-4'>
        <div className='flex items-center gap-3 mb-5'>
          <button
            type='button'
            className='btn btn-icon bg-bg-secondary shrink-0'
            onClick={() => (step === 2 ? setStep(1) : navigate('/login'))}
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <polyline points='15 18 9 12 15 6' />
            </svg>
          </button>
          <div>
            <h1 className='text-[22px] font-bold text-text-heading tracking-[-0.02em]'>
              회원가입
            </h1>
            <p className='text-[13px] text-text-muted'>
              {step === 1
                ? '거주 정보를 입력해주세요'
                : '신분증을 업로드해주세요'}
            </p>
          </div>
        </div>

        <StepIndicator total={2} current={step - 1} />
      </div>

      {step === 1 ? (
        <Step1 name={name} phone={phone} onNext={handleStep1Next} />
      ) : (
        <Step2 onSubmit={handleSubmit} isLoading={isLoading} />
      )}
    </div>
  );
}
