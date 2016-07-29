class Entry < ActiveRecord::Base
  EMAIL_REGEX = /\A[A-Z0-9._%a-z\-+]+@(?:[A-Z0-9a-z\-]+\.)+[A-Za-z]{2,12}\z/

  belongs_to :competition

  before_validation :clean_email

  validates_presence_of :competition, inverse_of: :entries
  validates_presence_of :email
  validates_format_of :email, :with => EMAIL_REGEX, allow_blank: true, allow_nil: true
  validates_presence_of :name, if: :requires_name
  validates :process_status, inclusion: { in: [ 'success', 'problem' ] }

  private
    def clean_email
      self.email = email.downcase.strip if email.present?
    end

    def requires_name
      competition && competition.requires_entry_name?
    end
end
