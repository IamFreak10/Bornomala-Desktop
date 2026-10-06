import { useState } from 'react';
import { PageTemplate } from '@/components/shared/PageTemplate';
import {
  usePromosQuery,
  useCreatePromoMutation,
  useUpdatePromoMutation,
  useDeletePromoMutation,
} from '../queries';
import { PromoType } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tag,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  GraduationCap,
  Users,
  Percent,
} from 'lucide-react';

export function PromosPage() {
  const [activeTab, setActiveTab] = useState<PromoType>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<PromoType>('student');
  const [ambassadorName, setAmbassadorName] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [formError, setFormError] = useState('');

  const { data: promos = [], isLoading } = usePromosQuery();
  const createPromoMutation = useCreatePromoMutation();
  const updatePromoMutation = useUpdatePromoMutation();
  const deletePromoMutation = useDeletePromoMutation();

  const filteredPromos = promos.filter((p) => {
    const matchesTab = p.type === activeTab;
    const matchesSearch =
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.ambassadorName &&
        p.ambassadorName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!code.trim() || !discountPercentage) {
      setFormError('প্রোমো কোড এবং ডিসকাউন্ট পার্সেন্টেজ দেওয়া আবশ্যক');
      return;
    }

    try {
      await createPromoMutation.mutateAsync({
        code: code.trim().toUpperCase(),
        type,
        ambassadorName: type === 'campus_ambassador' ? ambassadorName.trim() : undefined,
        discountPercentage: parseFloat(discountPercentage),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : undefined,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : undefined,
      });

      // Reset
      setCode('');
      setAmbassadorName('');
      setDiscountPercentage('');
      setMinOrderAmount('');
      setMaxDiscountAmount('');
      setUsageLimit('');
      setIsDialogOpen(false);
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message || err?.message || 'প্রোমো কোড তৈরি করা যায়নি'
      );
    }
  };

  const handleToggleActive = (promoId: number, currentStatus: boolean) => {
    updatePromoMutation.mutate({
      id: promoId,
      payload: { isActive: !currentStatus },
    });
  };

  const handleDelete = (promoId: number, promoCode: string) => {
    if (confirm(`আপনি কি "${promoCode}" কোডটি মুছে ফেলতে চান?`)) {
      deletePromoMutation.mutate(promoId);
    }
  };

  return (
    <PageTemplate
      title="প্রোমো কোড ব্যবস্থাপনা"
      subtitle="স্টুডেন্ট এবং ক্যাম্পাস এম্বাসেডরদের ডিসকাউন্ট কোড পরিচালনা করুন"
      badge={`${promos.length}টি মোট কোড`}
      actions={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground font-semibold">
              <Plus className="h-4 w-4" />
              নতুন প্রোমো কোড
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                নতুন প্রোমো কোড যোগ করুন
              </DialogTitle>
              <DialogDescription>
                স্টুডেন্ট বা ক্যাম্পাস এম্বাসেডরদের জন্য নতুন ডিসকাউন্ট কোড সেটআপ করুন।
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  কোডের ধরন <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('student')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      type === 'student'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    স্টুডেন্ট (Student)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('campus_ambassador')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      type === 'campus_ambassador'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    এম্বাসেডর (Ambassador)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  প্রোমো কোড <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="যেমনঃ STU10 বা DU_AMB15"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="font-mono text-sm uppercase"
                />
              </div>

              {type === 'campus_ambassador' && (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    ক্যাম্পাস এম্বাসেডরের নাম ও প্রতিষ্ঠান
                  </label>
                  <Input
                    placeholder="যেমনঃ রাকিব হাসান (ঢাকা বিশ্ববিদ্যালয়)"
                    value={ambassadorName}
                    onChange={(e) => setAmbassadorName(e.target.value)}
                    className="text-xs"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    ডিসকাউন্ট (%) <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="যেমনঃ 10"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                      className="pr-7 text-xs font-mono"
                      min="1"
                      max="100"
                    />
                    <Percent className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    সর্বনিম্ন অর্ডার (৳)
                  </label>
                  <Input
                    type="number"
                    placeholder="0 = কোনো সীমা নেই"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    সর্বোচ্চ ডিসকাউন্ট Cap (৳)
                  </label>
                  <Input
                    type="number"
                    placeholder="খালি থাকলে আনলিমিটেড"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    ব্যবহারের সর্বোচ্চ সীমা
                  </label>
                  <Input
                    type="number"
                    placeholder="খালি থাকলে আনলিমিটেড"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs text-destructive font-medium bg-destructive/10 p-2 rounded-lg">
                  {formError}
                </p>
              )}

              <Button
                type="submit"
                disabled={createPromoMutation.isPending}
                className="w-full gap-2 font-semibold"
              >
                {createPromoMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    তৈরি হচ্ছে...
                  </>
                ) : (
                  'প্রোমো কোড সেইভ করুন'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Sub Navigation Tabs & Search Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'student'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            স্টুডেন্ট ডিসকাউন্ট (Student)
          </button>
          <button
            onClick={() => setActiveTab('campus_ambassador')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'campus_ambassador'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Users className="h-4 w-4" />
            ক্যাম্পাস এম্বাসেডর (Ambassadors)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="কোড বা নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Promos List / Grid */}
      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filteredPromos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
          <Tag className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">কোনো প্রোমো কোড পাওয়া যায়নি</p>
          <p className="text-xs text-muted-foreground mt-1">
            নতুন প্রোমো কোড যুক্ত করতে ওপরের বোতামে ক্লিক করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPromos.map((promo) => (
            <div
              key={promo.promoId}
              className={`rounded-2xl border p-4 transition-all bg-card space-y-3 ${
                promo.isActive
                  ? 'border-border shadow-xs'
                  : 'border-border/60 opacity-60 bg-muted/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold tracking-wider text-foreground">
                      {promo.code}
                    </span>
                    <Badge
                      variant={promo.isActive ? 'success' : 'outline'}
                      className="text-[10px]"
                    >
                      {promo.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}
                    </Badge>
                  </div>
                  {promo.ambassadorName && (
                    <p className="text-xs font-medium text-primary mt-1 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {promo.ambassadorName}
                    </p>
                  )}
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(promo.promoId, promo.code)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Offer Details */}
              <div className="rounded-xl bg-accent/40 p-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">ডিসকাউন্ট</span>
                  <span className="font-bold text-emerald-600 text-sm font-mono">
                    {promo.discountPercentage}% OFF
                  </span>
                </div>
                {promo.maxDiscountAmount && (
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[10px]">সর্বোচ্চ ডিসকাউন্ট</span>
                    <span className="font-semibold text-foreground font-mono">
                      ৳{promo.maxDiscountAmount}
                    </span>
                  </div>
                )}
                {promo.minOrderAmount && Number(promo.minOrderAmount) > 0 && (
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[10px]">সর্বনিম্ন অর্ডার</span>
                    <span className="font-semibold text-foreground font-mono">
                      ৳{promo.minOrderAmount}
                    </span>
                  </div>
                )}
              </div>

              {/* Usage & Actions */}
              <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                <span className="font-mono text-[11px]">
                  ব্যবহার: <strong>{promo.usedCount}</strong>{' '}
                  {promo.usageLimit ? `/ ${promo.usageLimit}` : 'বার'}
                </span>

                <Button
                  size="xs"
                  variant={promo.isActive ? 'outline' : 'default'}
                  onClick={() => handleToggleActive(promo.promoId, promo.isActive)}
                  className="gap-1 text-[11px]"
                >
                  {promo.isActive ? (
                    <>
                      <XCircle className="h-3 w-3" />
                      বন্ধ করুন
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      চালু করুন
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTemplate>
  );
}
