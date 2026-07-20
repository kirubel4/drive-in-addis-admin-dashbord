import { useEffect, useState } from 'react'
import { Dialog } from '../../components/ui/Dialog'
import { Button } from '../../components/ui/Button'
import { Input, Label, Select } from '../../components/ui/Input'
import { useCreateZone, useUpdateZone } from './hooks'
import type { Zone, ZoneType } from '../../types'

const typeLabels: Record<ZoneType, string> = {
  SCHOOL: 'School zone',
  CONSTRUCTION: 'Construction zone',
  HOSPITAL: 'Hospital zone',
}

interface ZoneDialogProps {
  open: boolean
  onClose: () => void
  zone?: Zone | null
}

export function ZoneDialog({ open, onClose, zone }: ZoneDialogProps) {
  const isEdit = !!zone
  const createZone = useCreateZone()
  const updateZone = useUpdateZone()

  const [name, setName] = useState('')
  const [type, setType] = useState<ZoneType>('SCHOOL')
  const [lat, setLat] = useState('8.98')
  const [lng, setLng] = useState('38.75')
  const [radius, setRadius] = useState('250')
  const [speedLimit, setSpeedLimit] = useState('20')

  useEffect(() => {
    if (zone) {
      setName(zone.name)
      setType(zone.type)
      setLat(String(zone.lat))
      setLng(String(zone.lng))
      setRadius(String(zone.radiusMeters))
      setSpeedLimit(String(zone.speedLimit))
    } else {
      setName('')
      setType('SCHOOL')
      setLat('8.98')
      setLng('38.75')
      setRadius('250')
      setSpeedLimit('20')
    }
  }, [zone, open])

  const pending = createZone.isPending || updateZone.isPending

  async function handleSubmit() {
    if (!name.trim()) return
    const payload = {
      name: name.trim(),
      type,
      lat: Number(lat),
      lng: Number(lng),
      radiusMeters: Number(radius),
      speedLimit: Number(speedLimit),
    }
    if (isEdit && zone) {
      await updateZone.mutateAsync({ id: zone.id, patch: payload })
    } else {
      await createZone.mutateAsync(payload)
    }
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit zone' : 'Create zone'}
      size="md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={pending} disabled={!name.trim()}>
            {isEdit ? 'Save changes' : 'Create zone'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="zone-name">Name</Label>
          <Input id="zone-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bole Medhanialem School" />
        </div>

        <div>
          <Label htmlFor="zone-type">Type</Label>
          <Select id="zone-type" value={type} onChange={(e) => setType(e.target.value as ZoneType)}>
            {(Object.keys(typeLabels) as ZoneType[]).map((t) => (
              <option key={t} value={t}>
                {typeLabels[t]}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="zone-lat">Latitude</Label>
            <Input id="zone-lat" type="number" step="0.0001" value={lat} onChange={(e) => setLat(e.target.value)} className="font-mono" />
          </div>
          <div>
            <Label htmlFor="zone-lng">Longitude</Label>
            <Input id="zone-lng" type="number" step="0.0001" value={lng} onChange={(e) => setLng(e.target.value)} className="font-mono" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="zone-radius">Radius (meters)</Label>
            <Input id="zone-radius" type="number" value={radius} onChange={(e) => setRadius(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="zone-speed">Speed limit (km/h)</Label>
            <Input id="zone-speed" type="number" value={speedLimit} onChange={(e) => setSpeedLimit(e.target.value)} />
          </div>
        </div>
      </div>
    </Dialog>
  )
}
