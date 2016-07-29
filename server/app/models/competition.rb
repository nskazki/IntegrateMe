class Competition < ActiveRecord::Base
  EMAIL_REGEX = /\A[A-Z0-9._%a-z\-+]+@(?:[A-Z0-9a-z\-]+\.)+[A-Za-z]{2,12}\z/

  has_many :entries, inverse_of: :competition

  before_validation :clean_owner_email

  validates_presence_of :name
  validates_presence_of :mail_api_key
  validates_presence_of :mail_list_id
  validates_presence_of :owner_email
  validates_format_of :owner_email, with: EMAIL_REGEX, allow_blank: true, allow_nil: true

  private

  def clean_owner_email
    self.owner_email = owner_email.downcase.strip if owner_email.present?
  end
end
