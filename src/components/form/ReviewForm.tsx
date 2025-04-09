export default function ReviewForm({
  action,
  initialValue,
}: {
  action: (formData: FormData) => void
  initialValue?: { title: string; content: string; rating: number }
}) {
  const isEdit = !!initialValue
  return (
    <form action={action}>
      <label>
        별점
        <input
          type='number'
          name='rating'
          defaultValue={initialValue?.rating}
          step='0.5'
          min='0.5'
          max='5'
          required
        />
      </label>

      <input type='text' name='title' defaultValue={initialValue?.title} required />
      <textarea name='content' defaultValue={initialValue?.content} required />

      <button className='btn' type='submit'>
        {isEdit ? '수정' : '작성'}
      </button>
    </form>
  )
}
