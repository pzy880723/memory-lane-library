import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useEditor } from "@/lib/editor/EditorContext";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function PasswordDialog({ open, onOpenChange }: Props) {
  const { tryUnlock } = useEditor();
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (tryUnlock(pwd)) {
      setPwd("");
      setError(false);
      onOpenChange(false);
    } else {
      setError(true);
      setPwd("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setPwd(""); setError(false); } onOpenChange(v); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-4 h-4" /> 内容编辑
          </DialogTitle>
          <DialogDescription>请输入编辑密码以进入内容编辑模式</DialogDescription>
        </DialogHeader>
        <Input
          type="password"
          placeholder="密码"
          value={pwd}
          autoFocus
          onChange={(e) => { setPwd(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className={error ? "border-destructive" : ""}
        />
        {error && <p className="text-xs text-destructive">密码不正确，请重试</p>}
        <Button onClick={submit} disabled={!pwd}>进入编辑</Button>
      </DialogContent>
    </Dialog>
  );
}
